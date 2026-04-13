"use client";

import { useEffect, useRef, useState } from "react";
import { MicOff, PhoneOff, Mic, SendHorizonal, AlertTriangle, Video, VideoOff } from "lucide-react";
import { ProctoringFlag } from "@/src/schema/session/index.type";
import "./style.css";

type CallState = "connecting" | "user-speaking" | "ai-speaking" | "idle";

export interface VideoMessage {
    role: "user" | "assistant";
    content: string;
}

interface VideoCallOverlayProps {
    isOpen: boolean;
    isAiSpeaking: boolean;
    isUserSpeaking: boolean;
    stream: MediaStream | null;
    onHangUp: () => void;
    onStopAndSend: () => void;
    onStartRecording: () => void;
    transcript?: string;
    callMessages?: VideoMessage[];
    proctoringFlags?: ProctoringFlag[];
}

export const VideoCallOverlay = ({
    isOpen,
    isAiSpeaking,
    isUserSpeaking,
    stream,
    onHangUp,
    transcript,
    onStopAndSend,
    onStartRecording,
    callMessages = [],
    proctoringFlags = [],
}: VideoCallOverlayProps) => {
    const [callDuration, setCallDuration] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            setCallDuration(0);
            timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
        } else {
            setMounted(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [callMessages, transcript]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const formatDuration = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    const callState: CallState = isAiSpeaking
        ? "ai-speaking"
        : isUserSpeaking
            ? "user-speaking"
            : "idle";

    if (!mounted) return null;

    return (
        <div className="co-overlay">
            <div className="co-shell vc-shell">

                {/* ── LEFT: conversation log ── */}
                <div className="co-messages-panel">
                    <div className="co-messages-header">
                        <span className="co-messages-header-dot" />
                        Call transcript
                    </div>
                    <div className="co-messages-scroll">
                        {callMessages.length === 0 && !isUserSpeaking && (
                            <div className="co-msg-empty">Start recording to begin…</div>
                        )}
                        {callMessages.map((msg, i) => (
                            <div key={i} className={`co-bubble-wrap ${msg.role}`}>
                                <span className="co-bubble-label">
                                    {msg.role === "user" ? "You" : "Skill Charge"}
                                </span>
                                <div className={`co-bubble ${msg.role}`}>{msg.content}</div>
                            </div>
                        ))}

                        {isUserSpeaking && (
                            <div className="co-bubble-wrap user">
                                <span className="co-bubble-label">You</span>
                                <div className="co-bubble user streaming">
                                    {transcript || "Listening…"}
                                    <span className="co-cursor" />
                                </div>
                            </div>
                        )}
                        {isAiSpeaking && (
                            <div className="co-bubble-wrap assistant">
                                <span className="co-bubble-label">Skill Charge</span>
                                <div className="co-bubble assistant streaming">
                                    {transcript || ""}
                                    <span className="co-cursor" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* ── RIGHT: camera + controls ── */}
                <div className="co-controls-panel vc-controls-panel">
                    <div className="co-status-chip">
                        <span className="co-messages-header-dot" />
                        {callState === "ai-speaking"
                            ? "AI Responding"
                            : callState === "user-speaking"
                                ? "Recording"
                                : "Connected"}
                    </div>

                    {/* Webcam preview */}
                    <div className="vc-camera-wrap">
                        {stream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className={`vc-video ${callState === "user-speaking" ? "vc-video-active" : ""}`}
                            />
                        ) : (
                            <div className="vc-camera-placeholder">
                                <VideoOff size={28} className="vc-camera-off-icon" />
                                <span>Camera off</span>
                            </div>
                        )}

                        {/* Recording indicator overlay */}
                        {callState === "user-speaking" && (
                            <div className="vc-rec-badge">
                                <span className="vc-rec-dot" />
                                REC
                            </div>
                        )}
                    </div>

                    {/* Proctoring alerts */}
                    {proctoringFlags.length > 0 && (
                        <div className="vc-alerts">
                            {proctoringFlags.map((flag, i) => (
                                <div key={i} className="vc-alert">
                                    <AlertTriangle size={11} />
                                    <span>
                                        Multiple faces detected ({flag.max_faces})
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {callState === "ai-speaking" && (
                        <div className="co-state-badge ai">
                            <MicOff size={11} /> Mic muted
                        </div>
                    )}
                    {callState === "user-speaking" && (
                        <div className="co-state-badge user">
                            <Mic size={11} /> Recording
                        </div>
                    )}

                    <div className="co-spacer" />

                    <div className="co-timer">{formatDuration(callDuration)}</div>

                    <div className="co-actions">
                        {callState === "idle" && (
                            <button className="co-btn co-btn-record" onClick={onStartRecording}>
                                <Video size={14} /> Record Message
                            </button>
                        )}

                        {callState === "user-speaking" && (
                            <button className="co-btn co-btn-send" onClick={onStopAndSend}>
                                <SendHorizonal size={14} /> Send Message
                            </button>
                        )}

                        {callState === "ai-speaking" && (
                            <button className="co-btn co-btn-send" disabled>
                                <SendHorizonal size={14} /> AI Responding…
                            </button>
                        )}

                        <button className="co-btn co-btn-hangup" onClick={onHangUp}>
                            <PhoneOff size={14} /> End Call
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VideoCallOverlay;
