import {z} from "zod";

export const difficultyEnum = z.enum(["easy", "medium", "hard"])

export const CreatePersonaRequest = z.object({
    name: z.string(),
    description: z.string(),
    is_default: z.boolean(),
    is_active: z.boolean(),
    target_role: z.string(),
    experience_years: z.number(),
    domain: z.string(),
    difficulty: difficultyEnum,
    skills: z.array(z.string()),
    system_prompt: z.string(),
    enable_video_proctoring: z.boolean(),
    enable_audio_proctoring: z.boolean(),
    enable_tab_detection: z.boolean()
})

export const CreatePersonaResponse = CreatePersonaRequest.extend({
    id: z.string(),
    user_id: z.string()
})

export const PersonaListSchema = z.array(CreatePersonaResponse)