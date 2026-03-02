import {z} from "zod";
import {UserSchema} from "@/src/schema/user/index";

export type UserResponse = z.infer<typeof UserSchema>;