"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "fade" | "scale";

interface RevealProps {
    children: React.ReactNode;
    variant?: Variant;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
    className?: string;
}

const hiddenStyles: Record<Variant, string> = {
    fadeUp:    "opacity-0 translate-y-10",
    fadeDown:  "opacity-0 -translate-y-10",
    fadeLeft:  "opacity-0 translate-x-10",
    fadeRight: "opacity-0 -translate-x-10",
    fade:      "opacity-0",
    scale:     "opacity-0 scale-95",
};

const visibleStyle = "opacity-100 translate-y-0 translate-x-0 scale-100";


export default function Reveal({
                                   children,
                                   variant = "fadeUp",
                                   delay = 0,
                                   duration = 600,
                                   threshold = 0.15,
                                   once = true,
                                   className = "",
                               }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    return (
        <div
            ref={ref}
            className={`
        transition-all ease-out will-change-transform
        ${visible ? visibleStyle : hiddenStyles[variant]}
        ${className}
      `}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}