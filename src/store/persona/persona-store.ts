import { PersonaList} from "@/src/schema/persona/index.type";
import {create} from "zustand";
import useSWRImmutable from "swr/immutable";
import {PersonaService} from "@/src/service";
import {setCookieAction} from "@/src/actions/auth";

interface PersonaStore {
    personas: PersonaList,
    setPersonas: (persona: PersonaList) => void,
}

const usePersonaStore = create<PersonaStore>()(
    (set) => ({
        personas: [],
        setPersonas: (personas: PersonaList) => set({personas})
    })
)

export const usePersona = () => {
    const {personas, setPersonas} = usePersonaStore();

    const {isLoading, mutate} = useSWRImmutable(
        "personas", async () => await PersonaService.getPersonas(),
        {
            onSuccess: async (data) => {
                if (data.success && data?.data) {
                    setPersonas(data?.data);
                    if (data.data.length > 0) {
                        await setCookieAction("has_persona", "true", 60*60*24*6);
                    }
                }
            }
        }
    )

    return {
        personas,
        setPersonas,
        personasLoading: isLoading,
        mutatePersonas: mutate,
    }
}