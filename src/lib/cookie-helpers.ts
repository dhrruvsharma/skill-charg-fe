import "server-only";

import { cookies } from "next/headers";

export async function getCookie(name: string): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
}

export async function deleteCookie(name: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}

export async function setCookie(
    name: string,
    value: string,
    maxAge: number = 10 * 60,
    path?: string
): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
        path,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
        maxAge,
    });
}