import {LoginRequest, LoginResponse, OtpRequest, SignupRequest} from "@/src/schema/auth/index.type";
import {BooleanResponse, ClientResponse} from "@/src/schema/response/index.type";
import {BaseController} from "@/src/service/controller/base";
import {AuthResponseSchema} from "@/src/schema/auth";
import {BooleanResponseSchema} from "@/src/schema/response";

export default class AuthController extends BaseController {
    constructor(backendUrl: string) {
        super(`${backendUrl}/api/v1/auth`)
    }
    async login(req: LoginRequest): Promise<ClientResponse<LoginResponse>> {
        return this.post(`/login`,req,AuthResponseSchema, "data");
    }
    async signup(req: SignupRequest): Promise<ClientResponse<BooleanResponse>> {
        return this.post(`/signup`,req,BooleanResponseSchema, "data");
    }
    async verifyOtp(req: OtpRequest): Promise<ClientResponse<LoginResponse>> {
        return this.post(`/verify-otp`,req,AuthResponseSchema, "data");
    }
    async googleCallback(code: string,state: string): Promise<ClientResponse<LoginResponse>> {
        return this.post(`/google/callback`, { code, state }, AuthResponseSchema, "data");
    }
    async resendOtp(req: { email: string }): Promise<ClientResponse<BooleanResponse>> {
        return this.post(`/resend-verification`, req, BooleanResponseSchema, "data");
    }
}