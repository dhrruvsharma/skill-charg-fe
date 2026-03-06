"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
    LayoutDashboard,
    Users,
    UserPlus,
    Zap,
    Menu,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/src/components/ui/sheet";

const navLinks = [
    {
        label: "Dashboard",
        href: "/user/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "View Personas",
        href: "/user/persona/list",
        icon: Users,
    },
    {
        label: "Create Persona",
        href: "/user/persona",
        icon: UserPlus,
    },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/6 bg-[#0a0a0f]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">

                <Link
                    href="/user/dashboard"
                    className="group flex items-center gap-2 transition-opacity hover:opacity-90"
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md">
                        <Zap className="h-4 w-4 fill-white text-white" />
                    </div>
                    <span
                        className="text-[15px] font-semibold tracking-tight text-white"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
            Skill
            <span className="text-emerald-400">Charge</span>
          </span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link key={href} href={href}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "h-8 gap-2 rounded-md px-3 text-[13px] font-medium transition-all",
                                        isActive
                                            ? "bg-white/8 text-white"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "h-3.5 w-3.5",
                                            isActive ? "text-emerald-400" : "text-zinc-500"
                                        )}
                                    />
                                    {label}
                                    {isActive && (
                                        <span className="ml-0.5 h-1 w-1 rounded-full bg-emerald-400" />
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <div className="hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full ring-1 ring-white/10 transition-all ">
                        <span className="text-[11px] font-semibold text-white">SC</span>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-white md:hidden"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-64 border-white/6 bg-[#0a0a0f] p-0"
                        >
                            <div className="flex h-14 items-center border-b border-white/6 px-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md">
                                        <Zap className="h-3.5 w-3.5 fill-white text-white" />
                                    </div>
                                    <span
                                        className="text-sm font-semibold text-white"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    >
                                        Skill<span className="text-emerald-400">Charge</span>
                                    </span>
                                </div>
                            </div>

                            <nav className="flex flex-col gap-1 p-3">
                                {navLinks.map(({ label, href, icon: Icon }) => {
                                    const isActive = pathname === href;
                                    return (
                                        <Link key={href} href={href}>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "h-9 w-full justify-start gap-3 rounded-md px-3 text-[13px] font-medium",
                                                    isActive
                                                        ? "bg-white/8 text-white"
                                                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "h-4 w-4",
                                                        isActive ? "text-emerald-400" : "text-zinc-500"
                                                    )}
                                                />
                                                {label}
                                                {isActive && (
                                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                )}
                                            </Button>
                                        </Link>
                                    );
                                })}

                                <Separator className="my-2 bg-white/6" />

                                <div className="flex items-center gap-3 rounded-md px-3 py-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-white/10">
                                        <span className="text-[11px] font-semibold text-white">SC</span>
                                    </div>
                                    <span className="text-[13px] text-zinc-400">My Account</span>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px">
                <div className="mx-auto h-full max-w-7xl px-4 sm:px-6">
                    <div className="h-full" />
                </div>
            </div>
        </header>
    );
}