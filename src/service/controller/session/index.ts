import {BaseController} from "@/src/service/controller/base";
import {ClientResponse} from "@/src/schema/response/index.type";
import {
    ChatHistoryResponse,
    MessageResponse,
    SessionResponse,
    SessionResponseList
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
}