import {z} from "zod";

export const UserSchema = z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    is_verified: z.boolean(),
})