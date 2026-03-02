"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Reveal from "../../common/Reveal";

// ─── Data ─────────────────────────────────────────────────────────────────────

const links = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#steps" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "/changelog" },
    ],
    Resources: [
        { label: "Documentation", href: "/docs" },
        { label: "API Reference", href: "/api" },
        { label: "Blog", href: "/blog" },
        { label: "Support", href: "/support" },
    ],
    Company: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
    ],
};

const socials = [
    { icon: Github, label: "GitHub", href: "https://github.com" },
    { icon: Twitter, label: "Twitter / X", href: "https://x.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Mail, label: "Email", href: "mailto:hello@interviewai.com" },
];

// ─── Newsletter Input ─────────────────────────────────────────────────────────

function NewsletterRow() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-mono tracking-[0.15em] uppercase text-white/30">
                Stay in the loop
            </p>
            {submitted ? (
                <div className="flex items-center gap-2 text-sm font-body text-emerald-400/80">
                    <span className="text-base">✓</span> You&#39;re subscribed.
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 h-9 rounded-lg border border-white/10 bg-white/4 px-3 text-sm font-body text-white/60 placeholder:text-white/20 focus:outline-none focus:border-emerald-400/30 focus:bg-white/6 transition-colors"
                    />
                    <button
                        onClick={() => email && setSubmitted(true)}
                        className="group h-9 px-3.5 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/10 transition-colors duration-200 flex items-center justify-center"
                    >
                        <ArrowRight size={14} className="text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all duration-200" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Footer() {

    return (
        <Reveal className="px-10" once={false}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
      `}</style>

            <footer className="relative w-full bg-[#080808] font-body overflow-hidden">

                <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-[0.04]"
                        style={{ background: "radial-gradient(ellipse, #34D399, transparent 70%)" }}
                    />
                    <div className="absolute inset-0 opacity-[0.015]"
                         style={{
                             backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                             backgroundSize: "60px 60px",
                         }}
                    />
                </div>

                <div>

                    <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-400/20 to-cyan-400/10 border border-emerald-400/20 flex items-center justify-center">
                                    <span className="text-emerald-400 text-sm font-display font-bold">AI</span>
                                </div>
                                <span className="font-display text-white text-lg font-semibold tracking-tight">
                  InterviewAI
                </span>
                            </div>

                            <p className="font-body text-white/35 text-sm leading-relaxed max-w-xs">
                                AI-powered interview preparation that adapts to your role, your pace, and your goals.
                            </p>

                            <div className="flex items-center gap-2">
                                {socials.map(({ icon: Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className="w-8 h-8 rounded-lg border border-white/10 bg-white/3 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200"
                                    >
                                        <Icon size={14} strokeWidth={1.5} />
                                    </a>
                                ))}
                            </div>

                            <NewsletterRow />
                        </div>

                        {/* Link columns */}
                        {Object.entries(links).map(([category, items], colIndex) => (
                            <div
                                key={category}
                            >
                                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30">
                                    {category}
                                </p>
                                <ul className="flex flex-col gap-3">
                                    {items.map(({ label, href }) => (
                                        <li key={label}>
                                            <a
                                                href={href}
                                                className="text-sm font-body text-white/40 hover:text-white/75 transition-colors duration-200 flex items-center gap-1.5 group"
                                            >
                        <span
                            className="w-0 group-hover:w-2 h-px bg-emerald-400/60 transition-all duration-200 rounded-full"
                        />
                                                {label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs font-mono text-white/20 tracking-wide">
                            © {new Date().getFullYear()} InterviewAI. All rights reserved.
                        </p>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
                            <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                All systems operational
              </span>
                        </div>

                        <p className="text-xs font-mono text-white/15">
                            Built with Next.js · Go · PostgreSQL
                        </p>
                    </div>
                </div>
            </footer>
        </Reveal>
    );
}