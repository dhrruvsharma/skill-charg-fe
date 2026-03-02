"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import {
    ArrowRight,
    Sparkles,
} from "lucide-react";
import {features} from "@/src/components/home/features/constants";

function FeatureCard({
                         feature,
                         index,
                     }: {
    feature: (typeof features)[0];
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const Icon = feature.icon;

    const slideFrom =
        index % 3 === 0
            ? "translate-x-[-40px]"
            : index % 3 === 1
                ? "translate-y-[40px]"
                : "translate-x-[40px]";

    return (
        <div
            ref={ref}
            className={`${feature.span} transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${slideFrom}`
            }`}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            <Card className="h-full group relative overflow-hidden border-0 bg-white/3 backdrop-blur-sm hover:bg-white/6 transition-all duration-500 cursor-default">
                {/* Accent glow on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                    style={{
                        background: `radial-gradient(300px circle at 0% 0%, ${feature.accent}12, transparent 70%)`,
                    }}
                />

                <div
                    className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                    style={{ background: feature.accent }}
                />

                <CardContent className="p-7 flex flex-col gap-5 h-full">
                    <div className="flex items-start justify-between">
                        <div
                            className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                            style={{ background: `${feature.accent}18`, border: `1px solid ${feature.accent}35` }}
                        >
                            <Icon size={20} style={{ color: feature.accent }} strokeWidth={1.5} />
                        </div>
                        <Badge
                            variant="outline"
                            className="text-[10px] font-mono tracking-widest uppercase border-white/10 text-white/30 group-hover:border-white/20 group-hover:text-white/50 transition-colors duration-300"
                        >
                            {feature.badge}
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        <h3 className="font-display text-white text-lg leading-snug tracking-tight">
                            {feature.title}
                        </h3>
                        <p className="text-white/45 text-sm leading-relaxed font-body group-hover:text-white/60 transition-colors duration-300">
                            {feature.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-auto">
            <span
                className="text-xs font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                style={{ color: feature.accent }}
            >
              Learn more
            </span>
                        <ArrowRight
                            size={13}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                            style={{ color: feature.accent }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SectionHeader() {
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
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
                <Sparkles size={13} className="text-emerald-400" strokeWidth={1.5} />
                <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/50">
          Everything you need
        </span>
            </div>

            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight max-w-3xl">
                Built for
                <br />
                <span className="relative inline-block">
          <span className="relative z-10 bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            real preparation
          </span>
                    <svg
                        className={`absolute -bottom-2 left-0 w-full transition-all duration-1000 delay-500 ${visible ? "opacity-100" : "opacity-0"}`}
                        viewBox="0 0 300 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                    >
            <path
                d="M2 8 Q75 3 150 7 Q225 11 298 5"
                stroke="url(#underlineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <defs>
              <linearGradient id="underlineGrad" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399" />
                <stop offset="0.5" stopColor="#22D3EE" />
                <stop offset="1" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </svg>
        </span>
            </h2>

            <p className="text-white/45 text-base sm:text-lg font-body max-w-xl leading-relaxed">
                Six interconnected systems that simulate the pressure, unpredictability,
                and depth of an actual technical interview.
            </p>
        </div>
    );
}


export default function Features() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
      `}</style>

            <section className="relative w-full min-h-screen bg-[#080808] py-28 px-4 overflow-hidden font-body">

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-[0.07]"
                         style={{ background: "radial-gradient(circle, #34D399, transparent 70%)" }} />
                    <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
                         style={{ background: "radial-gradient(circle, #60A5FA, transparent 70%)" }} />

                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-[0.03]"
                         style={{
                             backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
                             backgroundSize: "60px 60px",
                         }}
                    />

                    {/* Noise grain texture */}
                    <div className="absolute inset-0 opacity-[0.025]"
                         style={{
                             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                             backgroundRepeat: "repeat",
                             backgroundSize: "128px 128px",
                         }}
                    />
                </div>

                {/* ── Content ── */}
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-20">

                    <SectionHeader />

                    {/* Feature grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                        {features.map((feature, i) => (
                            <FeatureCard key={feature.title} feature={feature} index={i} />
                        ))}
                    </div>

                    {/* Bottom stat strip */}
                    <BottomStats />
                </div>
            </section>
        </>
    );
}

const stats = [
    { value: "∞", label: "Custom personas" },
    { value: "Real-time", label: "Audio & video" },
    { value: "6-layer", label: "Cheat detection" },
    { value: "AI", label: "Post-interview report" },
];

function BottomStats() {
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
            className={`grid grid-cols-2 sm:grid-cols-4 gap-px border border-white/[0.07] rounded-2xl overflow-hidden transition-all duration-700 delay-200 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
            {stats.map((stat, i) => (
                <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center gap-1.5 py-7 px-4 bg-white/2 hover:bg-white/5 transition-colors duration-300"
                    style={{ transitionDelay: `${i * 60}ms` }}
                >
          <span className="font-display text-2xl font-bold text-white tracking-tight">
            {stat.value}
          </span>
                    <span className="text-xs font-mono text-white/30 tracking-widest uppercase text-center">
            {stat.label}
          </span>
                </div>
            ))}
        </div>
    );
}