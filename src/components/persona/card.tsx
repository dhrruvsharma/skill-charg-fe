import {Briefcase, Clock, Pencil, Shield, Sparkles, Trash2, Zap} from "lucide-react";
import {Persona} from "@/src/schema/persona/index.type";
import {Button} from "@/src/components/ui/button";

const difficultyConfig: Record<string, { label: string; color: string; dot: string }> = {
    easy:   { label: "Easy",   color: "text-emerald-400/80", dot: "bg-emerald-400" },
    medium: { label: "Medium", color: "text-amber-400/80",   dot: "bg-amber-400"   },
    hard:   { label: "Hard",   color: "text-rose-400/80",    dot: "bg-rose-400"    },
};

interface PersonaCardProps {
    persona: Persona;
    onEdit: (persona: Persona) => void;
    onDelete: (persona: Persona) => void;
}


const PersonaCard = ({ persona, onEdit, onDelete }: PersonaCardProps) => {
    const diff = difficultyConfig[persona.difficulty] ?? difficultyConfig.medium;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/6 bg-white/3 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/5">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {persona.is_default && (
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-400/5">
                    <Sparkles size={9} className="text-emerald-400" />
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-emerald-400/70">Default</span>
                </div>
            )}

            <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                    <div className="shrink-0 w-9 h-9 rounded-xl border border-white/8 bg-white/5 flex items-center justify-center">
                        <Briefcase size={15} className="text-white/40" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1 pr-14">
                        <h3 className="font-display text-white/90 text-sm font-semibold tracking-tight truncate">{persona.name}</h3>
                        <p className="mt-0.5 text-xs font-body text-white/30 line-clamp-2 leading-relaxed">{persona.description}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-white/6 bg-white/3 text-[10px] font-mono text-white/35 tracking-wide">
                        <Clock size={9} className="text-white/25" />
                        {persona.experience_years}y exp
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-white/6 bg-white/3 text-[10px] font-mono text-white/35 tracking-wide">
                        <Zap size={9} className="text-white/25" />
                        {persona.domain}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-white/6 bg-white/3 text-[10px] font-mono tracking-wide ${diff.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${diff.dot} opacity-70`} />
                        {diff.label}
                    </span>
                    {!persona.is_active && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-white/6 bg-white/3 text-[10px] font-mono text-white/20 tracking-wide">
                            Inactive
                        </span>
                    )}
                </div>

                <div className="mb-4 px-3 py-2 rounded-lg bg-white/2.5 border border-white/5">
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/20 block mb-0.5">Target Role</span>
                    <span className="text-xs font-body text-white/55 font-medium">{persona.target_role}</span>
                </div>

                {persona.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {persona.skills.slice(0, 4).map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-0.5 rounded-full border border-white/6 bg-white/3 text-[10px] font-mono text-white/30 tracking-wide"
                            >
                                {skill}
                            </span>
                        ))}
                        {persona.skills.length > 4 && (
                            <span className="px-2 py-0.5 rounded-full border border-white/6 bg-white/3 text-[10px] font-mono text-white/20 tracking-wide">
                                +{persona.skills.length - 4}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-2 mb-5">
                    <Shield size={10} className="text-white/15" />
                    <div className="flex gap-1.5">
                        {persona.enable_video_proctoring && (
                            <span className="text-[9px] font-mono text-white/25 tracking-wide">Video</span>
                        )}
                        {persona.enable_audio_proctoring && (
                            <span className="text-[9px] font-mono text-white/25 tracking-wide">· Audio</span>
                        )}
                        {persona.enable_tab_detection && (
                            <span className="text-[9px] font-mono text-white/25 tracking-wide">· Tab</span>
                        )}
                        {!persona.enable_video_proctoring && !persona.enable_audio_proctoring && !persona.enable_tab_detection && (
                            <span className="text-[9px] font-mono text-white/20 tracking-wide">No proctoring</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => onEdit(persona)}
                        className="group/btn flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-white/8 bg-white/3 text-white/35 text-[11px] font-mono tracking-wide transition-all duration-200 hover:border-white/15 hover:bg-white/6 hover:text-white/60"
                    >
                        <Pencil size={11} strokeWidth={1.5} />
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(persona)}
                        variant="destructive"
                    >
                        <Trash2 size={11} strokeWidth={1.5} />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default PersonaCard;