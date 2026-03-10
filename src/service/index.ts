import AuthController from "@/src/service/controller/auth";
import PersonaController from "@/src/service/controller/persona";
import SessionController from "@/src/service/controller/session";

const apiConfig = {
    auth: new AuthController(process.env.NEXT_PUBLIC_BACKEND_URL!),
    persona: new PersonaController(process.env.NEXT_PUBLIC_BACKEND_URL!),
    service: new SessionController(process.env.NEXT_PUBLIC_BACKEND_URL!),
}

export const AuthService = apiConfig.auth;
export const PersonaService = apiConfig.persona;
export const SessionService = apiConfig.service;