import {z} from "zod";
import {UserSchema} from "@/src/schema/user";

export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const SignUpRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    first_name: z.string(),
    last_name: z.string(),
})

export const AuthResponseSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    user: UserSchema,
})

export const VerifyOtpRequest = z.object({
    email: z.string().email(),
    otp: z.string()
})