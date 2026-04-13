import {BaseController} from "@/src/service/controller/base";
import {ClientResponse} from "@/src/schema/response/index.type";
import {
    ChatHistoryResponse,
    MessageResponse,
    SessionResponse,
    SessionResponseList, VideoMessageResult, VoiceMessageResult
} from "@/src/schema/session/index.type";
import {ChatHistoryResponseSchema, SessionResponseArraySchema, SessionResponseSchema} from "@/src/schema/session";

export default class SessionController extends BaseController {
    constructor(backendUrl: string) {
        super(`${backendUrl}/api/v1/sessions`);
    }
    async getSessions(): Promise<ClientResponse<SessionResponseList>> {
        return this.get("", SessionResponseArraySchema,"data");
    }
    async startSession(personaId: string): Promise<ClientResponse<SessionResponse>> {
        return this.post("",{persona_id: personaId},SessionResponseSchema,"data");
    }
    async getMessages(sessionId: string): Promise<ClientResponse<ChatHistoryResponse>> {
        return this.get(`/${sessionId}/messages`,ChatHistoryResponseSchema,"data");
    }
    async sendMessage(
        sessionId: string,
        content: string,
        onDelta: (text: string) => void,
        onDone: (msg: MessageResponse) => void,
        onError: (err: string) => void,
        headers: Record<string, string>
    ): Promise<void> {
        const res = await fetch(`${this.backendUrl}/${sessionId}/messages`, {
            method: "POST",
            body: JSON.stringify({ content }),
            headers: headers
        });

        if (!res.ok || !res.body) {
            onError(`HTTP ${res.status}`);
            return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
                if (!line.startsWith("data: ")) continue;
                const payload = line.slice(6).trim();
                if (!payload) continue;

                const evt = JSON.parse(payload);

                if (evt.type === "delta")  onDelta(evt.payload.content);
                if (evt.type === "error")  onError(evt.payload.message);
                if (evt.type === "done")   onDone(evt.payload);
            }
        }
    }
    async endSession(sessionId: string): Promise<ClientResponse<SessionResponse>> {
        return this.patch(`/${sessionId}/end`,{},SessionResponseSchema,"data");
    }
    async sendVideoMessage(
        sessionId: string,
        videoBlob: Blob,
        onTranscript: (text: string) => void,
        onProctoringFlag: (flag: { type: string; max_faces: number; timestamp: string }) => void,
        onDelta: (text: string) => void,
        onDone: (result: VideoMessageResult) => void,
        onError: (err: string) => void,
        headers: Record<string, string>
    ): Promise<void> {
        const form = new FormData();
        form.append("video", videoBlob, "recording.webm");

        const res = await fetch(`${this.backendUrl}/${sessionId}/video`, {
            method: "POST",
            body: form,
            headers,
        });

        if (!res.ok || !res.body) {
            onError(`HTTP ${res.status}`);
            return;
        }

        const reader = res.body.getReader();
        const audioChunks: Uint8Array[] = [];
        const decoder = new TextDecoder();
        let buffer = "";
        let lastEvent = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
                if (line.startsWith("event: ")) {
                    lastEvent = line.slice(7).trim();
                    continue;
                }
                if (!line.startsWith("data: ")) continue;
                const payload = line.slice(6);
                if (!payload) continue;

                if (lastEvent === "transcript")      onTranscript(payload);
                if (lastEvent === "delta")           onDelta(payload);
                if (lastEvent === "error")           onError(payload);
                if (lastEvent === "done")            onDone({ message: JSON.parse(payload), audioChunks });
                if (lastEvent === "proctoring_flag") onProctoringFlag(JSON.parse(payload));
                if (lastEvent === "audio") {
                    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
                    audioChunks.push(bytes);
                }
                lastEvent = "";
            }
        }
    }
    async sendVoiceMessage(
        sessionId: string,
        audioBlob: Blob,
        onTranscript: (text: string) => void,
        onDelta: (text: string) => void,
        onDone: (msg: VoiceMessageResult) => void,
        onError: (err: string) => void,
        headers: Record<string, string>
    ): Promise<void> {
        const form = new FormData();
        form.append("audio", audioBlob, "recording.webm");

        const res = await fetch(`${this.backendUrl}/${sessionId}/voice`, {
            method: "POST",
            body: form,
            headers,
        });

        if (!res.ok || !res.body) {
            onError(`HTTP ${res.status}`);
            return;
        }

        const reader = res.body.getReader();
        const audioChunks: Uint8Array[] = [];
        const decoder = new TextDecoder();
        let buffer = "";
        let lastEvent = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
                if (line.startsWith("event: ")) {
                    lastEvent = line.slice(7).trim();
                    continue;
                }
                if (!line.startsWith("data: ")) continue;
                const payload = line.slice(6);
                if (!payload) continue;

                if (lastEvent === "transcript") onTranscript(payload);
                if (lastEvent === "delta")      onDelta(payload);
                if (lastEvent === "error")      onError(payload);
                if (lastEvent === "done")       onDone({ message: JSON.parse(payload), audioChunks });
                if (lastEvent === "audio") {
                    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
                    audioChunks.push(bytes)
                }
                lastEvent = "";
            }
        }
    }
}