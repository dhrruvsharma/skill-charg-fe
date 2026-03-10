import {BaseController} from "@/src/service/controller/base";
import {ClientResponse} from "@/src/schema/response/index.type";
import {ChatHistoryResponse, SessionResponse, SessionResponseList} from "@/src/schema/session/index.type";
import {ChatHistoryResponseSchema, SessionResponseArraySchema, SessionResponseSchema} from "@/src/schema/session";

export default class SessionController extends BaseController {
    constructor(backendUrl: string) {
        super(`${backendUrl}/api/v1/sessions`);
    }
    async getSessions(): Promise<ClientResponse<SessionResponseList>> {
        return this.get("", SessionResponseArraySchema,"data");
    }
    async startSession(personaId: string): Promise<ClientResponse<SessionResponse>> {
        return this.post("",personaId,SessionResponseSchema,"data");
    }
    async getMessages(sessionId: string): Promise<ClientResponse<ChatHistoryResponse>> {
        return this.get(`/${sessionId}/messages`,ChatHistoryResponseSchema,"data");
    }
}