"use client";

import {useSearchParams} from "next/navigation";
import NoSession from "@/src/components/dashboard/no-session";
import ChatPanel from "@/src/components/dashboard/session/chat-panel";

const SessionWrapper = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) return <NoSession />
    return <ChatPanel />;
}

export default SessionWrapper;