import { NextRequest, NextResponse } from "next/server";
import { getCookie, deleteCookie } from "@/src/lib/cookie-helpers";

export async function POST(req: NextRequest) {
    const { code, state } = await req.json();

    const savedState = await getCookie("oauth_state");
    await deleteCookie("oauth_state");

    if (!savedState || savedState !== state) {
        return NextResponse.json({ success: false, error: { message: "Invalid OAuth state" } }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_URL}/api/v1/auth/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}