"use client";

import {useSessions} from "@/src/store/sessions/session-store";
import {Spinner} from "@/src/components/ui/spinner";
import {Separator} from "@/src/components/ui/separator";

const Sidebar = () => {
    const {sessions, sessionsLoading} = useSessions();

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
                            <div className="flex flex-col gap-4">
                                {sessions.map((session) => (
                                    <p key={session.id}>{session.started_at}</p>
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