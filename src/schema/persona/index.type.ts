import {z} from "zod";
import {CreatePersonaRequest, CreatePersonaResponse, PersonaListSchema} from "@/src/schema/persona/index";

export type CreatePersona = z.infer<typeof CreatePersonaRequest>;
export type Persona = z.infer<typeof CreatePersonaResponse>;
export type PersonaList = z.infer<typeof PersonaListSchema>;