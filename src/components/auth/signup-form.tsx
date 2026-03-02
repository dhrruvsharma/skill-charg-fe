"use client";

import {Controller, FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignUpRequestSchema} from "@/src/schema/auth";
import Reveal from "@/src/components/common/Reveal";
import {OtpRequest, SignupRequest} from "@/src/schema/auth/index.type";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/src/components/ui/field";
import {Input} from "@/src/components/ui/input";
import {AuthService} from "@/src/service";
import {toast} from "sonner";
import {useState} from "react";
import {Button} from "@/src/components/ui/button";
import Link from "next/link";
import {ArrowRight, Sparkles, Mail, RotateCcw, ShieldCheck} from "lucide-react";
import GoogleAuthButton from "@/src/components/auth/google-login";


interface OtpStepProps {
    email: string;
    onSuccess: () => void;
}

function OtpStep({email, onSuccess}: OtpStepProps) {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const next = [...otp];
        pasted.split("").forEach((char, i) => { next[i] = char; });
        setOtp(next);
        document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length < 6) {
            toast.error("Please enter all 6 digits");
            return;
        }
        setLoading(true);
        const req: OtpRequest = {email, otp: code};
        const {success, error, data} = await AuthService.verifyOtp(req);
        if (!success || error || !data) {
            toast.error(error?.message || "Invalid OTP — please try again");
            setLoading(false);
            return;
        }
        toast.success("Email verified!");
        onSuccess();
        setLoading(false);
    };

    const handleResend = async () => {
        setResending(true);
        const {success, error} = await AuthService.resendOtp({email});
        if (!success || error) {
            toast.error(error?.message || "Failed to resend OTP");
            setResending(false);
            return;
        }
        toast.success("New OTP sent!");
        setOtp(Array(6).fill(""));
        document.getElementById("otp-0")?.focus();
        setResending(false);
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center gap-6 py-2">
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-11 h-11 rounded-full border border-white/8 bg-white/4 flex items-center justify-center mb-1">
                    <Mail size={18} className="text-emerald-400/70" strokeWidth={1.5}/>
                </div>
                <p className="font-display text-white text-base font-semibold tracking-tight">Check your inbox</p>
                <p className="text-sm font-body text-white/35 max-w-[260px] leading-relaxed">
                    We sent a 6-digit code to <span className="text-white/60">{email}</span>
                </p>
            </div>

            <div className="flex gap-2.5" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        className={`w-11 h-12 text-center text-lg font-mono font-semibold rounded-lg border bg-white/3 text-white/90 outline-none transition-all duration-200 caret-emerald-400
                            ${digit ? "border-emerald-400/40 bg-emerald-400/5" : "border-white/8 hover:border-white/14"}
                            focus:border-emerald-400/50 focus:bg-emerald-400/5`}
                    />
                ))}
            </div>

            <Button
                type="button"
                onClick={handleVerify}
                disabled={loading || otp.join("").length < 6}
                className="group relative w-full overflow-hidden bg-white text-black hover:bg-white font-display text-sm font-semibold tracking-tight h-10 rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            Verifying...
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={14}/>
                            Verify email
                        </>
                    )}
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-black/[0.07] to-transparent skew-x-12"/>
            </Button>

            <button
                type="button"
                onClick={handleResend}
                disabled={resending || resendCooldown > 0}
                className="flex items-center gap-1.5 text-xs font-body text-white/25 hover:text-white/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
                <RotateCcw size={11} className={resending ? "animate-spin" : ""}/>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resending ? "Sending..." : "Resend code"}
            </button>
        </div>
    );
}

const SignupForm = () => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"signup" | "otp">("signup");
    const [submittedEmail, setSubmittedEmail] = useState("");

    const form = useForm({
        resolver: zodResolver(SignUpRequestSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        },
    });

    const handleSubmit = async (request: SignupRequest) => {
        setLoading(true);
        const {success, error} = await AuthService.signup(request);
        if (!success || error) {
            toast.error(error?.message || "Failed to create account");
            setLoading(false);
            return;
        }
        setSubmittedEmail(request.email);
        setStep("otp");
        setLoading(false);
    };

    const handleVerifySuccess = () => {
        // handle post-verification: store tokens, redirect, etc.
    };

    return (
        <div className="w-[dvh]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap');
                .font-display { font-family: 'Syne', sans-serif; }
                .font-body    { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <div className="font-body relative min-h-screen w-full flex items-center justify-center bg-[#080808] px-4 overflow-hidden">

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.06]"
                         style={{background: "radial-gradient(circle, #34D399, transparent 65%)"}}/>
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
                         style={{background: "radial-gradient(circle, #60A5FA, transparent 65%)"}}/>
                    <div className="absolute inset-0 opacity-[0.025]"
                         style={{
                             backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                             backgroundSize: "60px 60px",
                         }}/>
                    <div className="absolute inset-0 opacity-[0.025]"
                         style={{
                             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                             backgroundRepeat: "repeat",
                             backgroundSize: "128px 128px",
                         }}/>
                </div>

                <Reveal className="w-full flex items-center justify-center">
                    <div className="relative z-10 w-1/3">

                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
                                <Sparkles size={12} className="text-emerald-400" strokeWidth={1.5}/>
                                <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/40">
                                    {step === "otp" ? "Verify your email" : "Create your account"}
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-white/3 backdrop-blur-sm">
                            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-400/40 to-transparent"/>

                            <div className="absolute top-0 left-0 right-0 h-px">
                                <div className={`h-full bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-400 transition-all duration-700 ease-out ${step === "otp" ? "w-full" : "w-0"}`}/>
                            </div>

                            <div className="p-7">
                                {step === "signup" ? (
                                    <>
                                        {/* Header */}
                                        <div className="mb-6">
                                            <h1 className="font-display text-white text-2xl font-semibold tracking-tight">Sign up</h1>
                                            <p className="mt-1 text-sm font-body text-white/35">
                                                Already have an account?{" "}
                                                <Link href="/login" className="text-emerald-400/80 hover:text-emerald-400 transition-colors duration-200">
                                                    Sign in
                                                </Link>
                                            </p>
                                        </div>

                                        <GoogleAuthButton
                                            disabled={loading}
                                            onSuccess={handleVerifySuccess}
                                        />

                                        <div className="flex items-center gap-3 my-5">
                                            <div className="flex-1 h-px bg-white/6"/>
                                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">or</span>
                                            <div className="flex-1 h-px bg-white/6"/>
                                        </div>

                                        <FormProvider {...form}>
                                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                                <FieldGroup>
                                                    {/* Name row */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Controller
                                                            name="first_name"
                                                            control={form.control}
                                                            render={({field, fieldState}) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <FieldLabel className="text-xs font-mono tracking-widest uppercase text-white/30">
                                                                        First name
                                                                    </FieldLabel>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="John"
                                                                    />
                                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                                </Field>
                                                            )}
                                                        />
                                                        <Controller
                                                            name="last_name"
                                                            control={form.control}
                                                            render={({field, fieldState}) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <FieldLabel className="text-xs font-mono tracking-widest uppercase text-white/30">
                                                                        Last name
                                                                    </FieldLabel>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Doe"
                                                                    />
                                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                                </Field>
                                                            )}
                                                        />
                                                    </div>

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
                                                                    placeholder="example@example.com"
                                                                    autoComplete="off"
                                                                />
                                                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}
                                                    />

                                                    <Controller
                                                        name="password"
                                                        control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel className="text-xs font-mono tracking-widest uppercase text-white/30">
                                                                    Password
                                                                </FieldLabel>
                                                                <Input
                                                                    {...field}
                                                                    type="password"
                                                                    placeholder="Min. 8 characters"
                                                                />
                                                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
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
                                                                    Creating account...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Create account
                                                                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5"/>
                                                                </>
                                                            )}
                                                        </span>
                                                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-black/[0.07] to-transparent skew-x-12"/>
                                                    </Button>
                                                </div>

                                                <p className="text-center text-[11px] font-body text-white/20 leading-relaxed pt-1">
                                                    By signing up you agree to our{" "}
                                                    <Link href="/terms" className="text-white/35 hover:text-white/55 transition-colors">Terms</Link>
                                                    {" "}and{" "}
                                                    <Link href="/privacy" className="text-white/35 hover:text-white/55 transition-colors">Privacy Policy</Link>
                                                </p>
                                            </form>
                                        </FormProvider>
                                    </>
                                ) : (
                                    <OtpStep email={submittedEmail} onSuccess={handleVerifySuccess}/>
                                )}
                            </div>
                        </div>

                        {step === "otp" && (
                            <button
                                type="button"
                                onClick={() => setStep("signup")}
                                className="mt-4 w-full text-center text-xs font-body text-white/20 hover:text-white/40 transition-colors duration-200"
                            >
                                ← Wrong email? Go back
                            </button>
                        )}
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default SignupForm;