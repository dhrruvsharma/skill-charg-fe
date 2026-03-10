"use client";

import {useState} from "react";
import {usePersona} from "@/src/store/persona/persona-store";
import {toast} from "sonner";
import {SessionService} from "@/src/service";
import {useRouter} from "next/navigation";
import {useSessions} from "@/src/store/sessions/session-store";
import {Button} from "@/src/components/ui/button";
import {ArrowRight} from "lucide-react";

const NoSession = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const {personas} = usePersona();
    const {mutateSession} = useSessions()
    const router = useRouter();

    const handleStart = async () => {
        setLoading(true);
        const defaultPersona = personas.find(p => p.is_default) || personas[0];
        if (!defaultPersona) {
            toast.info("Please create a persona before session");
            setLoading(false);
            return;
        }
        const {success,error,data} = await SessionService.startSession(
            defaultPersona.id
        );
        if (!success || error || !data) {
            toast.error("Error starting session");
            setLoading(false);
            return;
        }
        router.replace(`/user/dashboard?sessionId=${data.id}`)
        await mutateSession();
        setLoading(false);
    }
    return (
        <div className="w-full h-[92dvh] flex flex-col gap-2 items-center justify-center">
            <h1>No Session Selected</h1>
            <Button disabled={loading} onClick={handleStart} type="button" className="bg-white cursor-pointer">
                New Session <ArrowRight />
            </Button>
        </div>
    )
}

export default NoSession;