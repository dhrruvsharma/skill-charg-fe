"use client";

import {Controller, FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginRequestSchema} from "@/src/schema/auth";
import Reveal from "@/src/components/common/Reveal";
import {LoginRequest} from "@/src/schema/auth/index.type";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/src/components/ui/field";
import {Input} from "@/src/components/ui/input";
import {AuthService} from "@/src/service";
import {toast} from "sonner";
import {useState} from "react";
import {Button} from "@/src/components/ui/button";
import Link from "next/link";
import {ArrowRight, Sparkles} from "lucide-react";
import GoogleAuthButton from "@/src/components/auth/google-login";
import {setCookieAction} from "@/src/actions/auth";
import {useRouter} from "next/navigation";

const LoginForm = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(LoginRequestSchema),
        defaultValues: {email: "", password: ""},
    });

    const handleSubmit = async (request: LoginRequest) => {
        setLoading(true);
        const {success, error, data} = await AuthService.login(request);
        if (!success || error || !data) {
            toast.error(error?.message || "Failed to authenticate");
            setLoading(false);
            return;
        }
        setLoading(false);
        await setCookieAction("refresh_token",data.refresh_token,60*60*24*6);
        await setCookieAction("access_token",data.access_token,60*60);
        router.replace("/user/dashboard");
    };

    return (
        <div className="w-[dvh] flex items-center justify-center">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap');
                .font-display { font-family: 'Syne', sans-serif; }
                .font-body    { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <div className="font-body relative min-h-screen w-full flex items-center justify-center bg-[#080808] px-4 overflow-hidden">

                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.06]"
                        style={{background: "radial-gradient(circle, #34D399, transparent 65%)"}}
                    />
                    <div
                        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
                        style={{background: "radial-gradient(circle, #60A5FA, transparent 65%)"}}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                            backgroundSize: "60px 60px",
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "repeat",
                            backgroundSize: "128px 128px",
                        }}
                    />
                </div>

                <Reveal className="w-full flex items-center justify-center">
                    <div className="relative z-10 w-1/3 min-h-min">

                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
                                <Sparkles size={12} className="text-emerald-400" strokeWidth={1.5}/>
                                <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/40">
                                    Welcome back
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-white/3 backdrop-blur-sm">
                            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-400/40 to-transparent"/>

                            <div className="p-7">
                                <div className="mb-6">
                                    <h1 className="font-display text-white text-2xl font-semibold tracking-tight">Sign in</h1>
                                    <p className="mt-1 text-sm font-body text-white/35">
                                        Don&#39;t have an account?{" "}
                                        <Link href="/signup" className="text-emerald-400/80 hover:text-emerald-400 transition-colors duration-200">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>

                                <GoogleAuthButton
                                    disabled={loading}
                                    onSuccess={async (data) => {
                                        await setCookieAction("access_token",data.access_token,60*60);
                                        await setCookieAction("refresh_token",data.refresh_token,60*60*24*6);
                                        router.replace("/user/dashboard");
                                    }}
                                />

                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex-1 h-px bg-white/6"/>
                                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">or</span>
                                    <div className="flex-1 h-px bg-white/6"/>
                                </div>

                                <FormProvider {...form}>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                        <FieldGroup>
                                            <Controller
                                                name="email"
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel className="text-xs font-mono tracking-widest uppercase text-white/30">
                                                            Email
                                                        </FieldLabel>
                                                        <Input
                                                            {...field}
                                                            id="email"
                                                            placeholder="example@example.com"
                                                            autoComplete="off"
                                                            className="mt-1.5 bg-white/3 border-white/8 hover:border-white/12 focus:border-emerald-400/30 focus:ring-0 text-white/80 placeholder:text-white/15 rounded-lg text-sm transition-colors duration-200"
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]}/>
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                name="password"
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="flex items-center justify-between">
                                                            <FieldLabel className="text-xs font-mono tracking-widest uppercase text-white/30">
                                                                Password
                                                            </FieldLabel>
                                                            <Link
                                                                href="/reset"
                                                                className="text-[11px] font-body text-white/25 hover:text-emerald-400/70 transition-colors duration-200"
                                                            >
                                                                Forgot password?
                                                            </Link>
                                                        </div>
                                                        <Input
                                                            {...field}
                                                            type="password"
                                                            placeholder="Enter password"
                                                            className="mt-1.5 bg-white/3 border-white/8 hover:border-white/12 focus:border-emerald-400/30 focus:ring-0 text-white/80 placeholder:text-white/15 rounded-lg text-sm transition-colors duration-200"
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]}/>
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>

                                        <div className="pt-1">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="group relative w-full overflow-hidden bg-white text-black hover:bg-white font-display text-sm font-semibold tracking-tight h-10 rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {loading ? (
                                                        <>
                                                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                                            </svg>
                                                            Signing in...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Sign in
                                                            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5"/>
                                                        </>
                                                    )}
                                                </span>
                                                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-black/[0.07] to-transparent skew-x-12"/>
                                            </Button>
                                        </div>
                                    </form>
                                </FormProvider>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default LoginForm;