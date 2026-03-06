"use client";

import { usePersona } from "@/src/store/persona/persona-store";
import { Persona } from "@/src/schema/persona/index.type";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, ChevronRight, Briefcase } from "lucide-react";
import PersonaCard from "@/src/components/persona/card";
import {useState} from "react";
import {PersonaService} from "@/src/service";
import {toast} from "sonner";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/src/components/ui/sheet";
import PersonaForm from "@/src/components/persona/form";
import {Button} from "@base-ui/react";

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-12 h-12 rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center mb-4">
            <Briefcase size={20} className="text-white/20" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-white/50 text-base font-semibold tracking-tight mb-1">No personas yet</h3>
        <p className="text-xs font-body text-white/20 mb-6 max-w-xs">
            Create your first interview persona to start practicing with a tailored AI interviewer.
        </p>
        <button
            onClick={onCreate}
            className="group flex items-center gap-2 px-4 h-9 rounded-lg border border-emerald-400/20 bg-emerald-400/5 text-emerald-400/70 text-xs font-mono tracking-wide transition-all duration-200 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-400"
        >
            <Plus size={13} strokeWidth={2} />
            Create Persona
        </button>
    </div>
);

const PersonaListComponent = () => {
    const { personas, personasLoading,mutatePersonas,setPersonas } = usePersona();
    const router = useRouter();
    const [selectedEditPersona, setSelectedEditPersona] = useState<Persona | null>(null);
    const [editOpen, setEditOpen] = useState<boolean>(false);

    const handleCreate = () => router.push("/user/persona");
    const handleEdit   = (p: Persona) => {
        setSelectedEditPersona(p);
        setEditOpen(true);
    }

    const handleEditSubmit = async (request: Persona) => {
        const {success,error,data} = await PersonaService.editPersona(request);
        if (!success || error || !data) {
            toast.error(error?.message || "Error creating persona");
            return;
        }
        toast.success("Persona edited!");
        setEditOpen(false);
        const updatedPersonas = personas.map(persona => {
            if (persona.id === request.id) {
                return data;
            }
            return persona;
        });
        setPersonas(updatedPersonas);
        await mutatePersonas();
    }

    const handleDelete = (p: Persona) => {

    }

    return (
        <div className="font-body relative min-h-screen w-full bg-[#080808] px-6 py-10 overflow-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap');
                .font-display { font-family: 'Syne', sans-serif; }
                .font-body    { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.05]"
                    style={{ background: "radial-gradient(circle, #34D399, transparent 65%)" }}
                />
                <div
                    className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(circle, #60A5FA, transparent 65%)" }}
                />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
                                <Sparkles size={11} className="text-emerald-400" strokeWidth={1.5} />
                                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">
                                    Personas
                                </span>
                            </div>
                        </div>
                        <h1 className="font-display text-white text-2xl font-semibold tracking-tight">
                            Interview Personas
                        </h1>
                        <p className="mt-1 text-sm font-body text-white/30">
                            {personasLoading
                                ? "Loading your personas..."
                                : `${personas.length} persona${personas.length !== 1 ? "s" : ""} configured`}
                        </p>
                    </div>

                    <Button
                        onClick={handleCreate}
                        className="group relative flex items-center gap-2 px-4 h-10 rounded-lg overflow-hidden bg-white text-black text-sm font-display font-semibold tracking-tight transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        New Persona
                        <ChevronRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-black/[0.07] to-transparent skew-x-12" />
                    </Button>
                </div>

                <div className="h-px bg-linear-to-r from-transparent via-white/8 to-transparent mb-8" />

                {personasLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-64 rounded-2xl border border-white/5 bg-white/2 animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {personas.length === 0 ? (
                            <EmptyState onCreate={handleCreate} />
                        ) : (
                            personas.map((persona) => (
                                <PersonaCard
                                    key={persona.id}
                                    persona={persona}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
            {(editOpen && selectedEditPersona) && (
                <Sheet
                    open={editOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedEditPersona(null);
                        }
                        setEditOpen(open)
                    }}
                >
                    <SheetTrigger className="sr-only">Open</SheetTrigger>
                    <SheetContent className="min-w-[800px] overflow-y-auto no-scrollbar">
                        <SheetHeader className="sr-only">
                            <SheetTitle>{selectedEditPersona.name}</SheetTitle>
                            <SheetDescription>Edit persona{selectedEditPersona.name}</SheetDescription>
                        </SheetHeader>
                        <PersonaForm
                            persona={selectedEditPersona}
                            onSubmit={handleEditSubmit}
                            onCancel={() => {
                                setEditOpen(false);
                                setSelectedEditPersona(null);
                            }}
                        />
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
};

export default PersonaListComponent;