"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {MessageResponse, MessageResponseList} from "@/src/schema/session/index.type";
import MessageCard from "@/src/components/dashboard/session/message-card";
import { SessionService } from "@/src/service";
import { toast } from "sonner";
import { Spinner } from "@/src/components/ui/spinner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { MessageSquare, SendHorizonal } from "lucide-react";
import {getCookieAction} from "@/src/actions/auth";

const ChatPanel = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    const [messages, setMessages] = useState<MessageResponseList>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        if (!sessionId) return;
        const fetchMessages = async () => {
            const { success, error, data } = await SessionService.getMessages(sessionId);
            if (!success || error || !data) {
                toast.error(error?.message || "Failed to get message");
                return;
            }
            setMessages(data.messages);
        };

        (async () => {
            setLoading(true);
            await fetchMessages();
            setLoading(false);
        })();
    }, [sessionId]);

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
            sequence_num: messages.length
        };

        const tempAsstId = crypto.randomUUID();
        const tempAsstMsg: MessageResponse = {
            id: tempAsstId,
            role: "assistant",
            content: "",
            created_at: new Date().toISOString(),
            session_id: sessionId,
            sequence_num: messages.length + 1
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
            {
                'Authorization': 'Bearer ' + token,
            }
        );
    };

    const isEmpty = !loading && messages.length === 0;

    return (
        <div className="chat-panel flex flex-col w-full h-[93dvh]">
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-4 min-h-0">
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

                {messages.map((message) => (
                    <MessageCard message={message} key={message.id} />
                ))}
            </div>

            <div className="flex items-center gap-2 border-t pt-4 shrink-0">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    disabled={!sessionId || loading}
                    className="flex-1"
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || !sessionId || loading}
                    size="icon"
                >
                    <SendHorizonal className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default ChatPanel;