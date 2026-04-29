"use client";

import { useState } from "react";
import { usePersona } from "@/src/store/persona/persona-store";
import { useSessions } from "@/src/store/sessions/session-store";
import { SessionService } from "@/src/service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Persona } from "@/src/schema/persona/index.type";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Briefcase, Check, Loader2, Star } from "lucide-react";
import { clsx } from "clsx";

interface PersonaPickerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PersonaPickerDialog({ open, onOpenChange }: PersonaPickerDialogProps) {
    const { personas, personasLoading } = usePersona();
    const { mutateSession } = useSessions();
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);
    const [starting, setStarting] = useState(false);

    const handleStart = async () => {
        if (!selected) return;
        setStarting(true);
        const { success, error, data } = await SessionService.startSession(selected);
        if (!success || error || !data) {
            toast.error(error?.message || "Error starting session");
            setStarting(false);
            return;
        }
        onOpenChange(false);
        router.replace(`/user/dashboard?sessionId=${data.id}`);
        await mutateSession();
        setStarting(false);
    };

    const handleSelect = (persona: Persona) => {
        setSelected(persona.id === selected ? null : persona.id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Select a Persona</DialogTitle>
                    <DialogDescription>
                        Choose which interview persona to use for this session.
                    </DialogDescription>
                </DialogHeader>

                {personasLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                ) : personas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                        <Briefcase className="w-8 h-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No personas found.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onOpenChange(false);
                                router.push("/user/persona");
                            }}
                        >
                            Create a Persona
                        </Button>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[300px] -mx-1 px-1">
                        <div className="flex flex-col gap-2">
                            {personas.map((persona) => (
                                <button
                                    key={persona.id}
                                    onClick={() => handleSelect(persona)}
                                    className={clsx(
                                        "w-full text-left rounded-lg border p-3 transition-colors cursor-pointer",
                                        selected === persona.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-sm font-medium truncate">{persona.name}</span>
                                            {persona.is_default && (
                                                <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            )}
                                        </div>
                                        {selected === persona.id && (
                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                        {persona.target_role} &middot; {persona.domain} &middot; {persona.difficulty}
                                    </p>
                                    {persona.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {persona.skills.slice(0, 3).map((skill) => (
                                                <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {persona.skills.length > 3 && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    +{persona.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                )}

                {personas.length > 0 && (
                    <DialogFooter>
                        <Button
                            onClick={handleStart}
                            disabled={!selected || starting}
                        >
                            {starting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Start Session
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
