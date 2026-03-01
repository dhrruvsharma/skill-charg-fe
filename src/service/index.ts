import AuthController from "@/src/service/controller/auth";

const apiConfig = {
    auth: new AuthController(process.env.API_URL!),
}

export const AuthService = apiConfig.auth;