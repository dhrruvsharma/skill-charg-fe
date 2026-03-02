"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import {
    ArrowRight,
    ChevronRight,
    MicIcon,
    Sparkles,
    Timer,
    CircleDot,
} from "lucide-react";
import Tags from "@/src/components/home/hero/tags";

function RecordingDot() {
    return (
        <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
    </span>
    );
}


function InterviewCard() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(t);
    }, []);

    const tags = [
        "Custom Job Descriptions",
        "Software Engineer",
        "Business Analyst",
        "Product Manager",
        "Marketing Specialist",
        "Data Scientist",
    ];

    return (
        <div
            className={`w-full lg:w-[52%] transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
        >
            <Card className="relative overflow-hidden border-0 bg-white/3 backdrop-blur-sm">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-400/40 to-transparent" />

                <CardContent className="p-0">
                    {/* Card header */}
                    <div className="flex items-start justify-between p-6 pb-4 border-b border-white/6">
                        <div className="flex flex-col gap-1">
              <span className="font-display text-white text-base font-semibold tracking-tight">
                Featured Interview Questions
              </span>
                            <span className="text-white/35 text-sm font-body">
                Turn a job description into questions to practise with.
              </span>
                        </div>
                        <Badge
                            variant="outline"
                            className="text-[10px] font-mono tracking-widest uppercase border-white/10 text-white/30 shrink-0"
                        >
                            Live
                        </Badge>
                    </div>

                    {/* Tags */}
                    <div className="px-6 pt-5 pb-4 flex flex-row flex-wrap gap-x-2 gap-y-2">
                        {tags.map((tag, i) => (
                            <Tags key={tag} text={tag} delay={400 + i * 60} />
                        ))}
                    </div>

                    <div className="mx-6 rounded-xl border border-white/8 bg-white/2 overflow-hidden">
                        <div className="flex flex-col items-center gap-5 p-6 text-center">
                            <div className="flex items-center gap-2 text-xs font-mono text-white/30 tracking-widest uppercase">
                                <RecordingDot />
                                Recording
                            </div>

                            <h2 className="font-display text-white/90 text-xl leading-snug tracking-tight max-w-sm">
                                Could you describe a coding challenge and how you faced it?
                            </h2>

                            {/* Timer */}
                            <div className="flex items-center gap-2">
                                <Timer size={14} className="text-white/25" strokeWidth={1.5} />
                                <span className="font-mono text-2xl font-bold tracking-widest text-white/60">
                  0:00
                  <span className="text-white/25 font-normal"> / 3:00</span>
                </span>
                            </div>

                            {/* Mic button */}
                            <button className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105">
                                {/* Outer pulse ring */}
                                <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                                <span className="absolute inset-0 rounded-full bg-red-500/10 border border-red-500/30" />
                                <MicIcon
                                    size={20}
                                    className="relative z-10 text-red-400"
                                    strokeWidth={1.5}
                                />
                            </button>
                        </div>

                        <div className="border-t border-white/6" />

                        {/* Feedback row */}
                        <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/4 transition-colors duration-200 group">
                            <div className="flex items-center gap-2.5">
                                <CircleDot size={13} className="text-emerald-400/60" strokeWidth={1.5} />
                                <span className="text-sm font-body text-white/40 group-hover:text-white/60 transition-colors duration-200">
                  Feedback
                </span>
                            </div>
                            <ChevronRight
                                size={15}
                                className="text-white/20 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all duration-200"
                            />
                        </button>

                        <div className="border-t border-white/6" />

                        {/* Sample response row */}
                        <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/4 transition-colors duration-200 group">
                            <div className="flex items-center gap-2.5">
                                <CircleDot size={13} className="text-blue-400/60" strokeWidth={1.5} />
                                <span className="text-sm font-body text-white/40 group-hover:text-white/60 transition-colors duration-200">
                  Sample Response
                </span>
                            </div>
                            <ChevronRight
                                size={15}
                                className="text-white/20 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all duration-200"
                            />
                        </button>
                    </div>

                    {/* Card footer */}
                    <div className="px-6 py-4 flex items-center gap-2">
                        <div className="h-1 flex-1 rounded-full bg-white/6 overflow-hidden">
                            <div className="h-full w-0 rounded-full bg-linear-to-r from-emerald-400 to-cyan-400" />
                        </div>
                        <span className="text-[10px] font-mono text-white/20 tracking-wider">0 / 10 questions</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function HeroCopy() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className={`flex flex-col items-start gap-6 w-full lg:w-[42%] transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
        >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
                <Sparkles size={12} className="text-emerald-400" strokeWidth={1.5} />
                <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/40">
          #1 AI Interview Prep
        </span>
            </div>

            <h1 className="font-display text-5xl xl:text-6xl text-white leading-[0.95] tracking-tight">
                Boost your
                <br />
                confidence,
                <br />
                <span className="relative inline-block">
          <span className="bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            ace the interview
          </span>
                    <svg
                        className="absolute -bottom-2 left-0 w-full"
                        viewBox="0 0 280 10"
                        fill="none"
                        preserveAspectRatio="none"
                    >
            <path
                d="M2 7 Q70 2 140 6 Q210 10 278 4"
                stroke="url(#heroUnderline)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <defs>
              <linearGradient id="heroUnderline" x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399" />
                <stop offset="0.5" stopColor="#22D3EE" />
                <stop offset="1" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </svg>
        </span>
            </h1>
            <p className="font-body text-white/45 text-lg leading-relaxed max-w-sm">
                Practice job interview questions tailored to your role. Get instant AI
                feedback and targeted coaching on every answer.
            </p>
            <div className="flex items-center gap-3 pt-1">
                <Button
                    className="group relative overflow-hidden bg-white text-black hover:bg-white font-display text-sm font-semibold tracking-tight px-6 h-11 rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.25)]"
                >
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-black/[0.07] to-transparent skew-x-12" />
                </Button>

                <button className="flex items-center gap-2 text-sm font-body text-white/35 hover:text-white/60 transition-colors duration-200">
                    See how it works
                    <ChevronRight size={14} />
                </button>
            </div>

            <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                    {["#34D399", "#60A5FA", "#F472B6", "#FBBF24"].map((color, i) => (
                        <div
                            key={i}
                            className="w-7 h-7 rounded-full border-2 border-[#080808]"
                            style={{ background: `${color}55`, borderColor: "#080808" }}
                        />
                    ))}
                </div>
                <p className="text-xs font-body text-white/30">
                    <span className="text-white/60 font-semibold">2,400+</span> interviews practised this week
                </p>
            </div>
        </div>
    );
}

export default function Hero() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
      `}</style>

            <section className="relative w-full min-h-screen bg-[#080808] flex items-center justify-center px-6 py-24 overflow-hidden font-body">

                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.06]"
                        style={{ background: "radial-gradient(circle, #34D399, transparent 65%)" }}
                    />
                    <div
                        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
                        style={{ background: "radial-gradient(circle, #60A5FA, transparent 65%)" }}
                    />

                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
              `,
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

                <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                    <HeroCopy />
                    <InterviewCard />
                </div>
            </section>
        </>
    );
}