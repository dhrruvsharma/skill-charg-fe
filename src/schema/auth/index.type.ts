import {z} from "zod";
import {LoginRequestSchema, AuthResponseSchema, SignUpRequestSchema, VerifyOtpRequest} from "@/src/schema/auth/index";

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type SignupRequest = z.infer<typeof SignUpRequestSchema>;
export type LoginResponse = z.infer<typeof AuthResponseSchema>;
export type OtpRequest = z.infer<typeof VerifyOtpRequest>;