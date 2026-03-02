"use client";

import { useEffect, useState } from "react";
import { AuthService } from "@/src/service";
import { toast } from "sonner";

const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google`;

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

interface GoogleAuthButtonProps {
    disabled?: boolean;
    onSuccess?: (data: { access_token: string; refresh_token: string; user: unknown }) => void;
}

export default function GoogleAuthButton({ disabled, onSuccess }: GoogleAuthButtonProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        if (!code || !state) return;

        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);

        const exchange = async () => {
            setLoading(true);
            const { success, error, data } = await AuthService.googleCallback(code,state);
            if (!success || error || !data) {
                toast.error(error?.message || "Google sign-in failed");
                setLoading(false);
                return;
            }
            toast.success("Signed in with Google!");
            onSuccess?.(data);
            setLoading(false);
        };

        exchange();
    }, []);

    const handleGoogleSignIn = () => {
        setLoading(true);
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={disabled || loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/8 bg-white/4 hover:bg-white/7 text-white/60 hover:text-white/80 text-sm font-body py-2.5 px-4 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {loading ? (
                <svg className="w-4 h-4 animate-spin text-white/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
            ) : (
                <GoogleIcon />
            )}
            {loading ? "Signing in..." : "Continue with Google"}
        </button>
    );
}