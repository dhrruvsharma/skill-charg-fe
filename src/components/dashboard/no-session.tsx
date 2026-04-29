"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import PersonaPickerDialog from "@/src/components/dashboard/persona-picker-dialog";

const NoSession = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="w-full h-[92dvh] flex flex-col gap-2 items-center justify-center">
            <h1>No Session Selected</h1>
            <Button onClick={() => setDialogOpen(true)} type="button" className="bg-white cursor-pointer">
                New Session <ArrowRight />
            </Button>
            <PersonaPickerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    );
};

export default NoSession;
