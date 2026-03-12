"use client";

import { useEffect, useRef, useState } from "react";
import { MicOff, PhoneOff, Mic, SendHorizonal } from "lucide-react";
import "./style.css"

type CallState = "connecting" | "user-speaking" | "ai-speaking" | "idle";

export interface VoiceMessage {
    role: "user" | "assistant";
    content: string;
}

interface VoiceCallOverlayProps {
    isOpen: boolean;
    isAiSpeaking: boolean;
    isUserSpeaking: boolean;
    onHangUp: () => void;
    onStopAndSend: () => void;
    onStartRecording: () => void;
    transcript?: string;
    callMessages?: VoiceMessage[];
}

export const VoiceCallOverlay = ({isOpen, isAiSpeaking, isUserSpeaking, onHangUp, transcript, onStopAndSend, onStartRecording, callMessages = [],}: VoiceCallOverlayProps) => {
    const [callDuration, setCallDuration] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        <>
            <div className="co-overlay">
                <div className="co-shell">

                    {/* ── LEFT: conversation log ── */}
                    <div className="co-messages-panel">
                        <div className="co-messages-header">
                            <span className="co-messages-header-dot" />
                            Call transcript
                        </div>
                        <div className="co-messages-scroll">
                            {callMessages.length === 0 && !isUserSpeaking && (
                                <div className="co-msg-empty">Start speaking to begin…</div>
                            )}
                            {callMessages.map((msg, i) => (
                                <div key={i} className={`co-bubble-wrap ${msg.role}`}>
                                    <span className="co-bubble-label">
                                        {msg.role === "user" ? "You" : "Skill Charge"}
                                    </span>
                                    <div className={`co-bubble ${msg.role}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {/* Live streaming: show transcript as it comes in */}
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

                    {/* ── RIGHT: controls ── */}
                    <div className="co-controls-panel">
                        <div className="co-status-chip">
                            <span className="co-messages-header-dot" />
                            {callState === "ai-speaking"
                                ? "AI Responding"
                                : callState === "user-speaking"
                                    ? "Listening"
                                    : "Connected"}
                        </div>

                        <div className="co-avatars">
                            <div className="co-avatar-wrap">
                                <div className={`co-avatar-ring ${callState === "user-speaking" ? "active" : ""}`}>
                                    <div className="co-avatar-circle co-avatar-user">You</div>
                                </div>
                                <span className="co-avatar-label">You</span>
                            </div>
                            <div className="co-connector" />
                            <div className="co-avatar-wrap">
                                <div className={`co-avatar-ring ${callState === "ai-speaking" ? "active" : ""}`}>
                                    <div className="co-avatar-circle co-avatar-ai">SC</div>
                                </div>
                                <span className="co-avatar-label">Skill Charge</span>
                            </div>
                        </div>

                        <div className="co-bars">
                            {Array.from({ length: 10 }).map((_, i) => {
                                const active = callState === "ai-speaking" || callState === "user-speaking";
                                const maxH = 6 + Math.random() * 18;
                                const dur = 0.4 + Math.random() * 0.5;
                                const delay = Math.random() * 0.4;
                                return (
                                    <div
                                        key={i}
                                        className={`co-bar ${active ? "active" : ""}`}
                                        style={{
                                            "--max": `${maxH}px`,
                                            "--dur": `${dur}s`,
                                            animationDelay: `${delay}s`,
                                        } as React.CSSProperties}
                                    />
                                );
                            })}
                        </div>

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
                            {/* idle → show Record button */}
                            {callState === "idle" && (
                                <button className="co-btn co-btn-record" onClick={onStartRecording}>
                                    <Mic size={14} /> Record Message
                                </button>
                            )}

                            {/* recording → show Send button */}
                            {callState === "user-speaking" && (
                                <button className="co-btn co-btn-send" onClick={onStopAndSend}>
                                    <SendHorizonal size={14} /> Send Message
                                </button>
                            )}

                            {/* ai speaking → send is disabled */}
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
        </>
    );
};

export default VoiceCallOverlay;