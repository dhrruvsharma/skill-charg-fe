"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { InterviewReport, MessageResponse, MessageResponseList } from "@/src/schema/session/index.type";
import MessageCard from "@/src/components/dashboard/session/message-card";
import InterviewReportCard from "@/src/components/dashboard/session/interview-report";
import { SessionService } from "@/src/service";
import { toast } from "sonner";
import { Spinner } from "@/src/components/ui/spinner";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Ban, Loader2, MessageSquare, Mic, MicOff, SendHorizonal, Video, VideoOff } from "lucide-react";
import { getCookieAction } from "@/src/actions/auth";
import { useSessions } from "@/src/store/sessions/session-store";
import { useVoiceRecorder } from "@/src/hooks/useVoiceRecorder";
import { useVideoRecorder } from "@/src/hooks/useVideoRecorder";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import VoiceCallOverlay, { VoiceMessage } from "@/src/components/dashboard/session/voice-overlay";
import VideoCallOverlay, { VideoMessage } from "@/src/components/dashboard/session/video-overlay";
import { ProctoringFlag } from "@/src/schema/session/index.type";

const ChatPanel = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    const { state: voiceState, start, stop } = useVoiceRecorder();
    const { state: videoState, start: videoStart, startSegment: videoStartSegment, stopSegment: videoStopSegment, stop: videoStopFull } = useVideoRecorder();
    const { sessions, mutateSession } = useSessions();
    const [messages, setMessages] = useState<MessageResponseList>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const assistantDeltaRef = useRef<string>("");

    // ── Voice-call overlay state ──────────────────────────────────────────
    const [callOpen, setCallOpen] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState<string>("");
    const [callMessages, setCallMessages] = useState<VoiceMessage[]>([]);
    const hangUpRef = useRef(false);

    // ── Video-call overlay state ──────────────────────────────────────────
    const [videoCallOpen, setVideoCallOpen] = useState(false);
    const [isVideoAiSpeaking, setIsVideoAiSpeaking] = useState(false);
    const [videoTranscript, setVideoTranscript] = useState<string>("");
    const [videoCallMessages, setVideoCallMessages] = useState<VideoMessage[]>([]);
    const [proctoringFlags, setProctoringFlags] = useState<ProctoringFlag[]>([]);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const videoHangUpRef = useRef(false);
    const videoAssistantDeltaRef = useRef<string>("");

    // ── Report state ──────────────────────────────────────────────────────
    const [report, setReport] = useState<InterviewReport | null>(null);

    const handleSessionEnd = async (rawReport: string) => {
        try {
            const parsed = JSON.parse(rawReport) as InterviewReport;
            setReport(parsed);
        } catch {
            toast.error("Failed to generate interview report");
        }

        // Stop video/voice streams so the camera/mic are released
        if (videoCallOpen) {
            await videoStopFull();
            setVideoStream(null);
        }
        if (voiceState === "recording") {
            await stop();
        }

        // Close any open overlays
        setCallOpen(false);
        setVideoCallOpen(false);
        setIsAiSpeaking(false);
        setIsVideoAiSpeaking(false);
        setLoading(false);
        mutateSession();
    };

    useEffect(() => {
        if (!sessionId) return;
        setReport(null);
        const fetchData = async () => {
            const { success, error, data } = await SessionService.getMessages(sessionId);
            if (!success || error || !data) {
                toast.error(error?.message || "Failed to get message");
                return;
            }
            setMessages(data.messages);
        };
        (async () => {
            setLoading(true);
            await fetchData();
            setLoading(false);
        })();
    }, [sessionId]);

    // Load report from session store once sessions are available (handles page refresh)
    useEffect(() => {
        if (!sessionId || report) return;
        const session = sessions.find((s) => s.id === sessionId);
        if (session?.status === "completed" && session.ai_report) {
            try {
                setReport(JSON.parse(session.ai_report) as InterviewReport);
            } catch { /* ignore parse errors */ }
        }
    }, [sessionId, sessions]);

    const handleSend = async () => {
        const token = await getCookieAction("access_token");
        const text = input.trim();
        if (!text || !sessionId) return;
        setInput("");

        const tempUserMsg: MessageResponse = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            created_at: new Date().toISOString(),
            session_id: sessionId,
            sequence_num: messages.length,
        };
        const tempAsstId = crypto.randomUUID();
        const tempAsstMsg: MessageResponse = {
            id: tempAsstId,
            role: "assistant",
            content: "",
            created_at: new Date().toISOString(),
            session_id: sessionId,
            sequence_num: messages.length + 1,
        };
        setMessages((prev) => [...prev, tempUserMsg, tempAsstMsg]);
        setLoading(true);

        await SessionService.sendMessage(
            sessionId,
            text,
            (delta) => {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempAsstId ? { ...m, content: m.content + delta } : m
                    )
                );
            },
            (finalMsg) => {
                setMessages((prev) =>
                    prev.map((m) => (m.id === tempAsstId ? finalMsg : m))
                );
                setLoading(false);
            },
            (err) => {
                toast.error(err);
                setLoading(false);
            },
            { Authorization: "Bearer " + token },
            handleSessionEnd,
        );
    };

    const handleEnd = async () => {
        if (!sessionId) return;
        const { success, error, data } = await SessionService.endSession(sessionId);
        if (!success || error || !data) {
            toast.error(error?.message || "Failed to end session");
            return;
        }
        toast.success("Session finished!");
        await mutateSession();

        // Show the report if the backend generated one
        if (data.ai_report) {
            try {
                setReport(JSON.parse(data.ai_report) as InterviewReport);
            } catch { /* ignore parse errors */ }
        }
    };

    const handleVoiceStart = async () => {
        if (!sessionId) return;
        hangUpRef.current = false;
        setLiveTranscript("");
        setIsAiSpeaking(false);
        await start();
    };

    const handleOpenCall = async () => {
        setCallMessages([]);
        setCallOpen(true);
        await handleVoiceStart();
    };

    const handleVoiceStop = async () => {
        const token = await getCookieAction("access_token");
        if (!sessionId) return;

        const audioBlob = await stop();
        setLiveTranscript("");

        const tempUserMsg: MessageResponse = {
            id: crypto.randomUUID(),
            role: "user",
            content: "🎙️ Transcribing...",
            created_at: new Date().toISOString(),
            session_id: sessionId,
            sequence_num: messages.length,
        };
        const tempAsstId = crypto.randomUUID();
        const tempAsstMsg: MessageResponse = {
            id: tempAsstId,
            role: "assistant",
            content: "",
            created_at: new Date().toISOString(),
            session_id: sessionId,
            sequence_num: messages.length + 1,
        };
        setMessages((prev) => [...prev, tempUserMsg, tempAsstMsg]);
        setLoading(true);

        await SessionService.sendVoiceMessage(
            sessionId,
            audioBlob,
            (transcript) => {
                if (hangUpRef.current) return;
                setLiveTranscript(transcript);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempUserMsg.id ? { ...m, content: transcript } : m
                    )
                );
                setCallMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last?.role === "user") {
                        return [...prev.slice(0, -1), { role: "user", content: transcript }];
                    }
                    return [...prev, { role: "user", content: transcript }];
                });
            },
            (delta) => {
                if (hangUpRef.current) return;
                setIsAiSpeaking(true);
                assistantDeltaRef.current += delta;
                setLiveTranscript((prev) => prev + delta);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempAsstId ? { ...m, content: m.content + delta } : m
                    )
                );
            },
            (result) => {
                if (hangUpRef.current) return;
                setIsAiSpeaking(false);

                const assistantContent = assistantDeltaRef.current;
                assistantDeltaRef.current = "";

                setCallMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: assistantContent },
                ]);
                setLiveTranscript("");
                setLoading(false);

                if (result.audioChunks.length > 0) {
                    const blob = new Blob(result.audioChunks as BlobPart[], { type: "audio/mpeg" });
                    const url = URL.createObjectURL(blob);
                    const audio = new Audio(url);
                    audio.play();
                    audio.onended = () => URL.revokeObjectURL(url);
                }
            },
            (err) => {
                toast.error(err);
                setIsAiSpeaking(false);
                setLoading(false);
            },
            { Authorization: "Bearer " + token },
            handleSessionEnd,
        );
    };

    const handleVoiceButton = async () => {
        if (voiceState === "idle") {
            await handleOpenCall();
        } else if (voiceState === "recording") {
            await handleVoiceStop();
        }
    };

    const handleHangUp = async () => {
        hangUpRef.current = true;
        assistantDeltaRef.current = "";
        setCallOpen(false);
        setIsAiSpeaking(false);
        setLiveTranscript("");
        setCallMessages([]);
        if (voiceState === "recording") {
            await stop();
        }
        setLoading(false);
    };

    // ── Video handlers ────────────────────────────────────────────────────
    const handleOpenVideoCall = async () => {
        if (!sessionId) return;
        videoHangUpRef.current = false;
        setVideoCallMessages([]);
        setProctoringFlags([]);
        setVideoTranscript("");
        setIsVideoAiSpeaking(false);
        const stream = await videoStart(); // opens camera + starts full-session recorder
        setVideoStream(stream);
        setVideoCallOpen(true);
    };

    /** Called by the overlay's "Record Message" button — starts a per-message segment. */
    const handleVideoRecordStart = () => {
        videoStartSegment();
    };

    const handleVideoStop = async () => {
        const token = await getCookieAction("access_token");
        if (!sessionId) return;

        const videoBlob = await videoStopSegment(); // only stops the segment; full recorder keeps going
        setVideoTranscript("");

        const tempUserMsg: MessageResponse = {
            id: crypto.randomUUID(),
            role: "user",
            content: "🎥 Transcribing...",
            created_at: new Date().toISOString(),
            session_id: sessionId,
            sequence_num: messages.length,
        };
        const tempAsstId = crypto.randomUUID();
        const tempAsstMsg: MessageResponse = {
            id: tempAsstId,
            role: "assistant",
            content: "",
            created_at: new Date().toISOString(),
            session_id: sessionId,
            sequence_num: messages.length + 1,
        };
        setMessages((prev) => [...prev, tempUserMsg, tempAsstMsg]);
        setLoading(true);

        await SessionService.sendVideoMessage(
            sessionId,
            videoBlob,
            (transcript) => {
                if (videoHangUpRef.current) return;
                setVideoTranscript(transcript);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempUserMsg.id ? { ...m, content: transcript } : m
                    )
                );
                setVideoCallMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last?.role === "user") {
                        return [...prev.slice(0, -1), { role: "user", content: transcript }];
                    }
                    return [...prev, { role: "user", content: transcript }];
                });
            },
            (flag) => {
                if (videoHangUpRef.current) return;
                setProctoringFlags((prev) => [...prev, flag]);
            },
            (delta) => {
                if (videoHangUpRef.current) return;
                setIsVideoAiSpeaking(true);
                videoAssistantDeltaRef.current += delta;
                setVideoTranscript((prev) => prev + delta);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempAsstId ? { ...m, content: m.content + delta } : m
                    )
                );
            },
            (result) => {
                if (videoHangUpRef.current) return;
                setIsVideoAiSpeaking(false);

                const assistantContent = videoAssistantDeltaRef.current;
                videoAssistantDeltaRef.current = "";

                setVideoCallMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: assistantContent },
                ]);
                setVideoTranscript("");
                setLoading(false);

                if (result.audioChunks.length > 0) {
                    const blob = new Blob(result.audioChunks as BlobPart[], { type: "audio/mpeg" });
                    const url = URL.createObjectURL(blob);
                    const audio = new Audio(url);
                    audio.play();
                    audio.onended = () => URL.revokeObjectURL(url);
                }
            },
            (err) => {
                toast.error(err);
                setIsVideoAiSpeaking(false);
                setLoading(false);
            },
            { Authorization: "Bearer " + token },
            handleSessionEnd,
        );
    };

    const handleVideoHangUp = async () => {
        videoHangUpRef.current = true;
        videoAssistantDeltaRef.current = "";
        setIsVideoAiSpeaking(false);
        setVideoTranscript("");
        setVideoCallMessages([]);
        setVideoCallOpen(false);
        setLoading(false);

        // Stop any in-progress segment silently
        if (videoState === "recording") {
            await videoStopSegment();
        }

        // Stop the full-session recorder and inject the recording into the chat
        const fullBlob = await videoStopFull();
        setVideoStream(null);

        if (fullBlob.size > 0 && sessionId) {
            const url = URL.createObjectURL(fullBlob);
            const videoMsg: MessageResponse = {
                id: crypto.randomUUID(),
                role: "user",
                content: `__video__:${url}`,
                created_at: new Date().toISOString(),
                session_id: sessionId,
                sequence_num: messages.length,
            };
            setMessages((prev) => [...prev, videoMsg]);
        }
    };

    const isEmpty = !loading && messages.length === 0;
    const isCompleted = sessions.find((s) => s.id === sessionId)?.status === "completed";

    return (
        <div className="w-full max-w-[78dvw] h-[93dvh]">
            <VideoCallOverlay
                isOpen={videoCallOpen}
                isAiSpeaking={isVideoAiSpeaking}
                isUserSpeaking={videoState === "recording"}
                isProcessing={loading && videoCallOpen && !isVideoAiSpeaking}
                stream={videoStream}
                onHangUp={handleVideoHangUp}
                onStopAndSend={handleVideoStop}
                onStartRecording={handleVideoRecordStart}
                transcript={videoTranscript}
                callMessages={videoCallMessages}
                proctoringFlags={proctoringFlags}
            />
            <VoiceCallOverlay
                isOpen={callOpen}
                isAiSpeaking={isAiSpeaking}
                isUserSpeaking={voiceState === "recording"}
                onHangUp={handleHangUp}
                onStopAndSend={handleVoiceStop}
                onStartRecording={handleVoiceStart}
                transcript={liveTranscript}
                callMessages={callMessages}
            />

            <div className="flex flex-col w-full h-[93dvh] overflow-hidden relative">
                {isCompleted && (
                    <div className="flex items-center justify-center gap-2 bg-muted/60 border-b px-4 py-2 text-sm text-muted-foreground shrink-0">
                        <Ban className="w-4 h-4 text-destructive" />
                        <span>This session has ended and is now read-only.</span>
                    </div>
                )}

                <ScrollArea className="pr-2 flex-1 min-h-0 no-scrollbar">
                        {loading && (
                            <div className="flex w-full h-full items-center justify-center">
                                <Spinner />
                            </div>
                        )}
                        {isEmpty && (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-16">
                                <MessageSquare className="w-10 h-10 opacity-30" />
                                <p className="text-sm font-medium">No messages yet</p>
                                <p className="text-xs opacity-60">Send a message to start the conversation</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <MessageCard message={message} key={message.id || index} />
                        ))}
                        {report && (
                            <InterviewReportCard
                                report={report}
                                onDismiss={() => setReport(null)}
                            />
                        )}
                </ScrollArea>

                <div className="flex items-end gap-2 border-t pt-4 pb-4 shrink-0 bg-background">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type a message... (Shift+Enter for new line)"
                        disabled={!sessionId || loading || isCompleted}
                        className="flex-1 min-h-[4rem] max-h-[10rem] resize-none"
                        rows={3}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || !sessionId || loading || isCompleted}
                        size="icon"
                    >
                        <SendHorizonal className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant={voiceState === "recording" ? "destructive" : "outline"}
                        onClick={handleVoiceButton}
                        disabled={!sessionId || loading || isCompleted || voiceState === "processing"}
                        title={voiceState === "recording" ? "Stop & send" : "Voice message"}
                    >
                        {voiceState === "processing" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : voiceState === "recording" ? (
                            <MicOff className="w-4 h-4" />
                        ) : (
                            <Mic className="w-4 h-4" />
                        )}
                    </Button>
                    <Button
                        size="icon"
                        variant={videoState === "recording" ? "destructive" : "outline"}
                        onClick={videoState === "idle" ? handleOpenVideoCall : handleVideoStop}
                        disabled={!sessionId || loading || isCompleted || videoState === "processing" || callOpen}
                        title={videoState === "recording" ? "Stop & send video" : "Video message"}
                    >
                        {videoState === "processing" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : videoState === "recording" ? (
                            <VideoOff className="w-4 h-4" />
                        ) : (
                            <Video className="w-4 h-4" />
                        )}
                    </Button>
                    <Button
                        size="icon"
                        disabled={loading || isCompleted}
                        name="End Session"
                        onClick={handleEnd}
                    >
                        <Ban />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;