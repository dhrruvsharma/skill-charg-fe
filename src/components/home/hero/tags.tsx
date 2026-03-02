import {useEffect, useState} from "react";

const Tags = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono tracking-wider border border-white/10 bg-white/4 text-white/40 hover:border-emerald-400/30 hover:text-emerald-400/70 hover:bg-emerald-400/5 transition-all duration-300 cursor-default select-none ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transition: `opacity 400ms ${delay}ms, transform 400ms ${delay}ms` }}
        >
      {text}
    </span>
    );
}

export default Tags;