import useSWRImmutable from "swr/immutable";
import {SessionService} from "@/src/service";

export const useSessions = () => {
    const {data, isLoading, mutate} = useSWRImmutable(
        "sessions", async () => await SessionService.getSessions()
    )

    return {
        sessions: data?.data || [],
        sessionsLoading: isLoading,
        mutateSession: mutate,
    }
}
