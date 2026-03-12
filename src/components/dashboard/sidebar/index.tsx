"use client";

import {useSessions} from "@/src/store/sessions/session-store";
import {Spinner} from "@/src/components/ui/spinner";
import {Separator} from "@/src/components/ui/separator";
import {useRouter, useSearchParams} from "next/navigation";
import {clsx} from "clsx";
import {formatDate} from "@/src/lib/date";

const Sidebar = () => {
    const {sessions, sessionsLoading} = useSessions();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");

    const handleClick = (id: string) => {
        router.replace(`/user/dashboard?sessionId=${id}`);
    }

    return (
        <aside className="sidebar h-[94dvh] w-[20dvw] bg-sidebar-accent flex flex-col gap-2 py-4 pl-4">
            <div className="flex flex-col gap-2">
                <h2 className="font-semibold">Sessions</h2>
                <Separator orientation="horizontal" />
            </div>
            <div className="flex flex-row gap-2 w-full h-full">
                {sessionsLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <Spinner />
                    </div>
                ): (
                    sessions.length > 0 ? (
                            <div className="flex flex-col gap-4 w-full">
                                {sessions.map((session) => (
                                    <p
                                        key={session.id}
                                        onClick={() => handleClick(session.id)}
                                        className={clsx(
                                            "hover: bg-secondary cursor-pointer w-full",
                                            {
                                                "bg-sidebar-accent": session.id === sessionId
                                            }
                                        )}
                                    >
                                        {formatDate(session.started_at)}
                                    </p>
                                ))}
                            </div>
                        ) :
                        <div className="flex items-center justify-center w-full h-full">
                            <p>No Sessions yet</p>
                        </div>
                )}
                <Separator orientation="vertical" />
            </div>
        </aside>
    )
}

export default Sidebar;