import {Switch} from "@/src/components/ui/switch";

interface ToggleRowProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}

const ToggleRow = ({ label, description, checked, onChange }: ToggleRowProps) => (
    <div className="flex items-center justify-between px-3.5 py-3 rounded-lg border border-white/5 bg-white/2 hover:border-white/8 transition-colors duration-200">
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-white/70 font-body">{label}</span>
            <span className="text-[11px] text-white/25 font-body">{description}</span>
        </div>
        <Switch
            checked={checked}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/10"
        />
    </div>
);

export default ToggleRow;