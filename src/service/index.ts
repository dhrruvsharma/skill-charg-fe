import AuthController from "@/src/service/controller/auth";
import PersonaController from "@/src/service/controller/persona";

const apiConfig = {
    auth: new AuthController(process.env.NEXT_PUBLIC_BACKEND_URL!),
    persona: new PersonaController(process.env.NEXT_PUBLIC_BACKEND_URL!),
}

export const AuthService = apiConfig.auth;
export const PersonaService = apiConfig.persona;