import {APIClient} from "@/src/service/core/config";

export default class AuthController {
    private apiClient: APIClient;
    constructor(private readonly backendUrl: string) {
        this.apiClient = new APIClient(backendUrl);
    }
}