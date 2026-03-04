import {BaseController} from "@/src/service/controller/base";
import {CreatePersona, Persona, PersonaList} from "@/src/schema/persona/index.type";
import {ClientResponse} from "@/src/schema/response/index.type";
import {CreatePersonaResponse, PersonaListSchema} from "@/src/schema/persona";

export default class PersonaController extends BaseController {
    constructor(backendUrl: string) {
        super(`${backendUrl}/api/v1/personas`);
    }
    async createPersonaRequest(
        req: CreatePersona,
        headers?: Record<string, string>
    ): Promise<ClientResponse<Persona>> {
        return this.post("",req,CreatePersonaResponse,"data",headers)
    }
    async getPersonas(headers?: Record<string, string>): Promise<ClientResponse<PersonaList>> {
        return this.get("", PersonaListSchema, "data", headers)
    }
}