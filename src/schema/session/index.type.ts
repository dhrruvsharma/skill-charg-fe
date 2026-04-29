import {z} from "zod";
import {
    ChatHistoryResponseSchema, InterviewReportSchema, MessageResponseArraySchema,
    MessageResponseSchema, MessageRoleSchema,
    SendMessageRequest, SessionResponseArraySchema,
    SessionResponseSchema, SessionStatusSchema, SSEDeltaPayloadSchema, SSEErrorPayloadSchema, SSEEventSchema
} from "@/src/schema/session/index";

export type SessionResponse = z.infer<typeof SessionResponseSchema>;
export type SendMessageRequest = z.infer<typeof SendMessageRequest>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type MessageResponseList = z.infer<typeof MessageResponseArraySchema>;
export type ChatHistoryResponse = z.infer<typeof ChatHistoryResponseSchema>;
export type SSEEvent = z.infer<typeof SSEEventSchema>;
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type MessageRole = z.infer<typeof MessageRoleSchema>;
export type SSEDeltaPayload = z.infer<typeof SSEDeltaPayloadSchema>;
export type SSEErrorPayload = z.infer<typeof SSEErrorPayloadSchema>;
export type SessionResponseList = z.infer<typeof SessionResponseArraySchema>;
export type VoiceMessageResult = {
    message: MessageResponse;
    audioChunks: Uint8Array[]
}

export type ProctoringFlag = {
    type: string;
    max_faces: number;
    timestamp: string;
}

export type VideoMessageResult = {
    message: MessageResponse;
    audioChunks: Uint8Array[];
}

export type InterviewReport = z.infer<typeof InterviewReportSchema>;