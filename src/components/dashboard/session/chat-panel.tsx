"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {MessageResponseList} from "@/src/schema/session/index.type";
import MessageCard from "@/src/components/dashboard/session/message-card";
import {SessionService} from "@/src/service";
import {toast} from "sonner";
import {Spinner} from "@/src/components/ui/spinner";

const ChatPanel = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    const [messages, setMessages] = useState<MessageResponseList>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!sessionId) return;
        const fetchMessages = async () => {
            const {success,error,data} = await SessionService.getMessages(sessionId);
            if (!success || error || !data) {
                toast.error(error?.message || "Failed to get message");
                return;
            }
            setMessages(data.messages);
        }

        (async () => {
            setLoading(true);
            await fetchMessages();
            setLoading(false);
        })()
    },[sessionId]);

    return (
        <div className="chat-panel flex flex-col gap-4 w-full h-full">
            {loading && (
                <div className="flex w-full h-full items-center justify-center-center">
                    <Spinner />
                </div>
            )}
            {messages.map((message) => (
                <MessageCard message={message} key={message.id} />
            ))}
        </div>
    )
}

export default ChatPanel;