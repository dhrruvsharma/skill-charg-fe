"use client";

import {useState} from "react";
import {useSessions} from "@/src/store/sessions/session-store";
import {Spinner} from "@/src/components/ui/spinner";
import {Separator} from "@/src/components/ui/separator";
import {useRouter, useSearchParams} from "next/navigation";
import {clsx} from "clsx";
import {formatDate} from "@/src/lib/date";
import {Button} from "@/src/components/ui/button";
import {Plus, Trash2} from "lucide-react";
import {SessionService} from "@/src/service";
import {toast} from "sonner";
import PersonaPickerDialog from "@/src/components/dashboard/persona-picker-dialog";

const Sidebar = () => {
    const {sessions, sessionsLoading, mutateSession} = useSessions();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClick = (id: string) => {
        router.replace(`/user/dashboard?sessionId=${id}`);
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const { success, error } = await SessionService.deleteSession(id);
        if (!success || error) {
            toast.error("Failed to delete session");
            return;
        }
        toast.success("Session deleted");
        if (sessionId === id) {
            router.replace("/user/dashboard");
        }
        await mutateSession();
    }

    return (
        <aside className="sidebar h-[94dvh] w-[20dvw] bg-sidebar-accent flex flex-col gap-2 py-4 pl-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between pr-4">
                    <h2 className="font-semibold">Sessions</h2>
                    <Button size="icon" variant="ghost" onClick={() => setDialogOpen(true)} title="New Session">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <Separator orientation="horizontal" />
            </div>
            <PersonaPickerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <div className="flex flex-row gap-2 w-full h-full">
                {sessionsLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <Spinner />
                    </div>
                ): (
                    sessions.length > 0 ? (
                            <div className="flex flex-col gap-4 w-full">
                                {sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() => handleClick(session.id)}
                                        className={clsx(
                                            "group flex items-center justify-between rounded-md px-2 py-1.5 cursor-pointer hover:bg-secondary transition-colors",
                                            {
                                                "bg-secondary": session.id === sessionId
                                            }
                                        )}
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm truncate">
                                                {session.persona_name || formatDate(session.started_at)}
                                            </span>
                                            {session.persona_name && (
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {formatDate(session.started_at)}
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity"
                                            onClick={(e) => handleDelete(e, session.id)}
                                            title="Delete session"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                        </Button>
                                    </div>
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