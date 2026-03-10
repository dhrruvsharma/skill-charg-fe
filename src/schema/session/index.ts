import {z} from "zod";


export const SessionStatusSchema = z.enum([
    "pending",
    "active",
    "completed",
    "abandoned",
]);

export const MessageRoleSchema = z.enum(["user", "assistant", "system"]);

export const SSEEventTypeSchema = z.enum(["delta", "done", "error"]);

export const SessionResponseSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    persona_id: z.string().optional(),
    status: z.string(),
    started_at: z.string(),
    ended_at: z.string().optional(),
    persona_name: z.string().optional(),
    system_prompt: z.string().optional(),
    duration_secs: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string().optional(),
})

export const SessionResponseArraySchema = z.array(SessionResponseSchema);

export const SendMessageRequest = z.object({
    content: z.string(),
})

export const MessageResponseSchema = z.object({
    id: z.string(),
    session_id: z.string(),
    role: z.string(),
    content: z.string(),
    sequence_num: z.number(),
    created_at: z.string()
})

export const MessageResponseArraySchema = z.array(MessageResponseSchema);

export const ChatHistoryResponseSchema = z.object({
    session_id: z.string(),
    messages: MessageResponseArraySchema,
})

export const SSEDeltaPayloadSchema = z.object({
    content: z.string(),
});

export const SSEErrorPayloadSchema = z.object({
    message: z.string(),
});

export const SSEEventSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("delta"),
        payload: SSEDeltaPayloadSchema,
    }),
    z.object({
        type: z.literal("done"),
        payload: MessageResponseSchema,
    }),
    z.object({
        type: z.literal("error"),
        payload: SSEErrorPayloadSchema,
    }),
]);
