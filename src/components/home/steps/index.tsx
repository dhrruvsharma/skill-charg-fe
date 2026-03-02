"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, UserPlus, Cpu, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const steps = [
    {
        number: "01",
        icon: UserPlus,
        title: "Create your account",
        description:
            "Sign up in seconds with your email or Google. Your profile is the foundation — every session, persona, and report lives here.",
        detail: "Email · Google OAuth · Secure JWT sessions",
        accent: "#6EE7B7",
        visual: <SignupVisual />,
    },
    {
        number: "02",
        icon: Cpu,
        title: "Build a persona",
        description:
            "Define who's interviewing you. Set the target role, company culture, domain, difficulty, and skills — the AI becomes that interviewer completely.",
        detail: "Unlimited personas · Custom system prompts · Domain-specific questioning",
        accent: "#93C5FD", // blue
        visual: <PersonaVisual />,
    },
    {
        number: "03",
        icon: Rocket,
        title: "Start your interview",
        description:
            "Jump into a live text, audio, or video session. Answer questions, get real-time AI feedback, and receive a full performance report when you're done.",
        detail: "Chat · Audio call · Video call · AI report",
        accent: "#F9A8D4", // pink
        visual: <StartVisual />,
    },
];

function SignupVisual() {
    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-2">
                <div className="h-9 rounded-lg border border-white/10 bg-white/4 px-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-white/25 w-16">Email</span>
                    <span className="text-xs font-body text-white/50">alex@company.com</span>
                </div>
                <div className="h-9 rounded-lg border border-white/10 bg-white/4 px-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-white/25 w-16">Password</span>
                    <span className="text-xs font-body text-white/30 tracking-widest">••••••••••</span>
                </div>
            </div>
            <button className="h-9 w-full rounded-lg bg-white text-black text-xs font-display font-semibold tracking-tight flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Get Started <ArrowRight size={12} />
            </button>
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-[10px] font-mono text-white/20">OR</span>
                <div className="flex-1 h-px bg-white/6" />
            </div>
            <button className="h-9 w-full rounded-lg border border-white/10 bg-white/3 text-xs font-body text-white/40 flex items-center justify-center gap-2 hover:bg-white/6 transition-colors">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
            </button>
        </div>
    );
}

function PersonaVisual() {
    const skills = ["Go", "System Design", "DSA", "Kubernetes"];
    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <span className="text-white/70 text-sm font-display font-semibold">Senior SWE @ Google</span>
                    <span className="text-white/25 text-xs font-mono">New Persona</span>
                </div>
                <div className="px-2 py-0.5 rounded-full border border-blue-400/20 bg-blue-400/6 text-[10px] font-mono text-blue-400/70">
                    Hard
                </div>
            </div>
            <div className="h-px bg-white/6" />
            <div className="flex flex-col gap-1.5">
                {[
                    { label: "Domain", value: "Software Engineering" },
                    { label: "Exp.", value: "7+ years" },
                    { label: "Style", value: "Behavioural + Technical" },
                ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                        <span className="text-white/25 text-xs font-mono">{row.label}</span>
                        <span className="text-white/55 text-xs font-body">{row.value}</span>
                    </div>
                ))}
            </div>
            <div className="h-px bg-white/6" />
            <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full border border-white/10 bg-white/3 text-[10px] font-mono text-white/40">
            {s}
          </span>
                ))}
                <span className="px-2 py-0.5 rounded-full border border-dashed border-white/10 text-[10px] font-mono text-white/20">+ Add skill</span>
            </div>
        </div>
    );
}

function StartVisual() {
    const modes = [
        { label: "Chat", color: "#6EE7B7", active: false },
        { label: "Audio", color: "#93C5FD", active: false },
        { label: "Video", color: "#F9A8D4", active: true },
    ];
    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-2">
                {modes.map((m) => (
                    <button
                        key={m.label}
                        className="flex-1 h-8 rounded-lg border text-xs font-mono tracking-wider transition-colors"
                        style={{
                            borderColor: m.active ? `${m.color}40` : "rgba(255,255,255,0.07)",
                            background: m.active ? `${m.color}0F` : "rgba(255,255,255,0.02)",
                            color: m.active ? m.color : "rgba(255,255,255,0.3)",
                        }}
                    >
                        {m.label}
                    </button>
                ))}
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/2 p-4 flex flex-col items-center gap-3">
                <div className="relative w-14 h-14 rounded-full bg-white/4 border border-white/10 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]" />
                </div>
                <span className="text-white/50 text-sm font-body text-center leading-snug">
          &#34;Tell me about a time you led a technical project under pressure.&#34;
        </span>
                <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
          </span>
                    <span className="text-[10px] font-mono text-white/25 tracking-widest">LIVE · 01:24</span>
                </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/6">
                <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">AI Report</span>
                <div className="flex-1 h-1 rounded-full bg-white/6">
                    <div className="h-full w-2/3 rounded-full bg-linear-to-r from-emerald-400 to-cyan-400" />
                </div>
                <span className="text-[10px] font-mono text-white/35">67%</span>
            </div>
        </div>
    );
}

function Step({ step, index, total }: { step: typeof steps[0]; index: number; total: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const Icon = step.icon;
    const isLast = index === total - 1;
    const isEven = index % 2 === 0;

    return (
        <div
            ref={ref}
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } ${!isEven ? "lg:flex-row-reverse" : ""}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >

            {/* ── Text side ── */}
            <div className="flex flex-col gap-6 flex-1">
                {/* Step number + connector */}
                <div className="flex items-center gap-4">
                    <div className="relative flex flex-col items-center">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
                            style={{ borderColor: `${step.accent}30`, background: `${step.accent}0F` }}
                        >
                            <Icon size={18} style={{ color: step.accent }} strokeWidth={1.5} />
                        </div>
                        {/* Connector line downward (only for non-last items on mobile) */}
                        {!isLast && (
                            <div
                                className="lg:hidden absolute top-11 w-px h-10 opacity-20"
                                style={{ background: `linear-gradient(to bottom, ${step.accent}, transparent)` }}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-0">
            <span
                className="text-[10px] font-mono tracking-[0.25em] uppercase"
                style={{ color: `${step.accent}70` }}
            >
              Step {step.number}
            </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-display text-4xl lg:text-5xl text-white leading-[0.95] tracking-tight">
                    {step.title}
                </h3>

                {/* Description */}
                <p className="font-body text-white/45 text-base lg:text-lg leading-relaxed max-w-md">
                    {step.description}
                </p>

                {/* Detail pill */}
                <div
                    className="inline-flex self-start items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-mono text-white/35"
                    style={{ borderColor: `${step.accent}20`, background: `${step.accent}07` }}
                >
                    <span style={{ color: `${step.accent}80` }}>→</span>
                    {step.detail}
                </div>
            </div>

            <div
                className={`w-full lg:w-[380px] shrink-0 rounded-2xl border bg-white/2.5 p-5 transition-all duration-500 hover:bg-white/4 group ${
                    visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{
                    borderColor: `${step.accent}18`,
                    transitionDelay: `${index * 100 + 150}ms`,
                    boxShadow: `0 0 60px -15px ${step.accent}18`,
                }}
            >
                <div
                    className="absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to right, transparent, ${step.accent}60, transparent)` }}
                />
                {step.visual}
            </div>
        </div>
    );
}

function StepsHeader() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`flex flex-col items-center text-center gap-5 transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/4">
                <Sparkles size={13} className="text-emerald-400" strokeWidth={1.5} />
                <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/50">
          Up and running in minutes
        </span>
            </div>

            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight max-w-2xl">
                Three steps to
                <br />
                <span className="bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          your next offer
        </span>
            </h2>

            <p className="font-body text-white/40 text-base sm:text-lg max-w-lg leading-relaxed">
                No setup headaches. Create an account, build a persona, and start practicing — all in under two minutes.
            </p>
        </div>
    );
}

export default function Steps() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
      `}</style>

            <section className="relative w-full bg-[#080808] py-28 px-6 overflow-hidden font-body">

                {/* Background atmosphere */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
                         style={{ background: "radial-gradient(circle, #93C5FD, transparent 70%)" }} />
                    <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
                         style={{ background: "radial-gradient(circle, #6EE7B7, transparent 70%)" }} />
                    <div className="absolute inset-0 opacity-[0.02]"
                         style={{
                             backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                             backgroundSize: "60px 60px",
                         }}
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-24">
                    <StepsHeader />

                    {/* Vertical connector line (desktop) */}
                    <div className="relative flex flex-col gap-28">
                        {/* Background connector */}
                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 opacity-[0.06]"
                             style={{ background: "linear-gradient(to bottom, transparent, #6EE7B7 20%, #93C5FD 50%, #F9A8D4 80%, transparent)" }}
                        />

                        {steps.map((step, i) => (
                            <Step key={step.number} step={step} index={i} total={steps.length} />
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <BottomCTA />
                </div>
            </section>
        </>
    );
}

function BottomCTA() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`flex flex-col items-center gap-6 pt-4 transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
            <p className="font-body text-white/30 text-sm">Ready to get started?</p>
            <Button className="group relative overflow-hidden bg-white text-black hover:bg-white font-display font-semibold tracking-tight px-8 h-12 rounded-xl text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]">
        <span className="relative z-10 flex items-center gap-2.5">
          Start practicing free
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-black/[0.07] to-transparent skew-x-12" />
            </Button>
        </div>
    );
}