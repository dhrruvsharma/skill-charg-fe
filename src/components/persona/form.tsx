"use client";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import { toast } from "sonner";
import { ArrowRight, Sparkles, X, Plus } from "lucide-react";
import { CreatePersonaRequest } from "@/src/schema/persona";
import { CreatePersona, Persona } from "@/src/schema/persona/index.type";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import Reveal from "@/src/components/common/Reveal";
import {DIFFICULTIES, DOMAINS} from "@/src/components/persona/constants";
import {PersonaService} from "@/src/service";
import {usePersona} from "@/src/store/persona/persona-store";
import {setCookieAction} from "@/src/actions/auth";
import ToggleRow from "@/src/components/persona/toggle-row";
import {useRouter} from "next/navigation";

interface PersonaFormProps {
    persona?: Persona;
    onSubmit?: (persona: Persona) => Promise<void>;
    onCancel?: () => void;
}

const PersonaForm = ({ persona, onSubmit, onCancel }: PersonaFormProps) => {
    const isEditing = !!persona;
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const {personas, setPersonas, mutatePersonas} = usePersona();
    const router = useRouter();

    const form = useForm<CreatePersona>({
        resolver: zodResolver(CreatePersonaRequest),
        defaultValues: {
            name: "",
            description: "",
            is_default: false,
            is_active: true,
            target_role: "",
            experience_years: 0,
            domain: persona?.domain || "general",
            difficulty: "medium",
            skills: [],
            system_prompt: "",
            enable_video_proctoring: false,
            enable_audio_proctoring: false,
            enable_tab_detection: true,
        },
    });

    useEffect(() => {
        if (persona) {
            form.reset(persona);
        }
    },[persona,form])

    const skills = form.watch("skills");

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (!trimmed) return;
        if (skills.includes(trimmed)) {
            toast.error("Skill already added");
            return;
        }
        form.setValue("skills", [...skills, trimmed]);
        setSkillInput("");
    };

    const removeSkill = (skill: string) => {
        form.setValue("skills", skills.filter((s) => s !== skill));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSubmit = async (request: CreatePersona) => {
        setLoading(true);
        if (persona) {
            const updatedPersona = {
                ...persona,
                ...request
            }
            await onSubmit?.(updatedPersona);
        } else {
            const {success,error,data} = await PersonaService.createPersonaRequest(request)
            if (!success || error || !data) {
                toast.error(error?.message || "Failed to create persona.");
                setLoading(false);
                return;
            }
            const updatedPersonaList = [data, ...personas];
            await setCookieAction("has_persona", "true",60*60*24*6);
            setPersonas(updatedPersonaList);
            toast.success("Persona added successfully.");
            await mutatePersonas();
        }
        setLoading(false);
        router.replace("/user/persona/list");
    };

    return (
        <div className="w-full flex items-center justify-center">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap');
                .font-display { font-family: 'Syne', sans-serif; }
                .font-body    { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <div className="font-body relative min-h-screen w-full flex items-center justify-center bg-[#080808] px-4 py-12 overflow-hidden">

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
                    <div className="relative z-10 w-full max-w-2xl">

                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
                                <Sparkles size={12} className="text-emerald-400" strokeWidth={1.5} />
                                <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/40">
                                    {isEditing ? "Edit Persona" : "New Persona"}
                                </span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-white/3 backdrop-blur-sm">
                            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-400/40 to-transparent" />

                            <div className="p-7">
                                <div className="mb-7">
                                    <h1 className="font-display text-white text-2xl font-semibold tracking-tight">
                                        {isEditing ? `Edit "${persona.name}"` : "Create a persona"}
                                    </h1>
                                    <p className="mt-1 text-sm font-body text-white/35">
                                        {isEditing
                                            ? "Update your interview persona settings below."
                                            : "Configure an interview persona tailored to your target role."}
                                    </p>
                                </div>

                                <FormProvider {...form}>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                                        <SectionLabel label="Identity" />
                                        <FieldGroup className="space-y-4 mt-2">

                                            <Controller
                                                name="name"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel>Name</FieldLabel>
                                                        <Input
                                                            {...field}
                                                            placeholder="e.g. Senior SWE at Google"
                                                        />
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </Field>
                                                )}
                                            />

                                            <Controller
                                                name="description"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel>Description</FieldLabel>
                                                        <Textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Brief context about this persona…"
                                                            className={`resize-none`}
                                                        />
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </Field>
                                                )}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <Controller
                                                    name="target_role"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <FieldLabel>Target Role</FieldLabel>
                                                            <Input
                                                                {...field}
                                                                placeholder="e.g. Software Engineer"
                                                            />
                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                        </Field>
                                                    )}
                                                />
                                                <Controller
                                                    name="experience_years"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <FieldLabel>Years of Experience</FieldLabel>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                min={0}
                                                                max={60}
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                                placeholder="0"
                                                            />
                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                        </Field>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <Controller
                                                    name="domain"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <FieldLabel>Domain</FieldLabel>
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select domain" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-[#111] border-white/8 text-white/80">
                                                                    {DOMAINS.map((d) => (
                                                                        <SelectItem
                                                                            key={d.value}
                                                                            value={d.value}
                                                                            className="focus:bg-white/6 focus:text-white text-white/70"
                                                                        >
                                                                            {d.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                        </Field>
                                                    )}
                                                />
                                                <Controller
                                                    name="difficulty"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <FieldLabel>Difficulty</FieldLabel>
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select difficulty" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-[#111] border-white/8 text-white/80">
                                                                    {DIFFICULTIES.map((d) => (
                                                                        <SelectItem
                                                                            key={d.value}
                                                                            value={d.value}
                                                                            className="focus:bg-white/6 focus:text-white text-white/70"
                                                                        >
                                                                            <span className={d.color}>{d.label}</span>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                        </Field>
                                                    )}
                                                />
                                            </div>
                                        </FieldGroup>

                                        <SectionLabel label="Skills" />
                                        <div className="space-y-3 mt-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="e.g. Go, System Design, Kubernetes…"
                                                    className={`flex-1`}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addSkill}
                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 bg-white/3 hover:border-emerald-400/30 hover:bg-emerald-400/5 text-white/50 hover:text-emerald-400 transition-all duration-200 text-xs font-mono"
                                                >
                                                    <Plus size={13} />
                                                    Add
                                                </Button>
                                            </div>
                                            {skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/5 text-emerald-300/80 text-xs font-mono"
                                                        >
                                                            {skill}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSkill(skill)}
                                                                className="text-emerald-400/40 hover:text-emerald-400 transition-colors"
                                                            >
                                                                <X size={11} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <SectionLabel label="AI System Prompt" />
                                        <div className="mt-2"/>
                                        <Controller
                                            name="system_prompt"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel>
                                                        System Prompt
                                                        <span className="ml-2 text-white/20 font-body normal-case tracking-normal text-[11px]">
                                                            injected as AI context during the interview
                                                        </span>
                                                    </FieldLabel>
                                                    <Textarea
                                                        {...field}
                                                        rows={5}
                                                        placeholder="You are a senior engineering interviewer at Google. Ask system design questions and evaluate candidates on…"
                                                        className={`resize-none font-mono text-xs`}
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />

                                        <SectionLabel label="Proctoring & Settings" />
                                        <div className="space-y-3 mt-2">
                                            <Controller
                                                name="enable_tab_detection"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <ToggleRow
                                                        label="Tab Detection"
                                                        description="Flag when the candidate switches browser tabs"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="enable_video_proctoring"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <ToggleRow
                                                        label="Video Proctoring"
                                                        description="Monitor for multiple faces or suspicious activity"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="enable_audio_proctoring"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <ToggleRow
                                                        label="Audio Proctoring"
                                                        description="Detect background voices or unusual audio"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <SectionLabel label="Persona Flags" />
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <Controller
                                                name="is_default"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <ToggleRow
                                                        label="Set as Default"
                                                        description="Use this persona by default for new sessions"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="is_active"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <ToggleRow
                                                        label="Active"
                                                        description="Inactive personas won't appear in session creation"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className={`pt-2 flex gap-3 ${onCancel ? "flex-row" : "flex-col"}`}>
                                            {onCancel && (
                                                <Button
                                                    type="button"
                                                    onClick={onCancel}
                                                    disabled={loading}
                                                    className="flex-1 bg-transparent border border-white/8 text-white/40 hover:bg-white/4 hover:text-white/60 hover:border-white/12 font-display text-sm font-semibold tracking-tight h-10 rounded-lg transition-all duration-200 disabled:opacity-40"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="group relative flex-1 overflow-hidden bg-white text-black hover:bg-white font-display text-sm font-semibold tracking-tight h-10 rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {loading ? (
                                                        <>
                                                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                            </svg>
                                                            {isEditing ? "Saving…" : "Creating…"}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isEditing ? "Save Changes" : "Create Persona"}
                                                            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                                                        </>
                                                    )}
                                                </span>
                                                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-black/[0.07] to-transparent skew-x-12" />
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


const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 -mb-2">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/25">{label}</span>
        <div className="flex-1 h-px bg-white/5" />
    </div>
);

export default PersonaForm;