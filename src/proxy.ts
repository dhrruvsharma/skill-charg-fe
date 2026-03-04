import {NextRequest, NextResponse} from "next/server";
import {getCookieAction} from "@/src/actions/auth";

export async function proxy(req: NextRequest) {
    const token = await getCookieAction("refresh_token");
    if (!token && !req.url.endsWith("/login")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    const hasPersona = await getCookieAction("has_persona");
    if (!hasPersona && !req.url.endsWith("/persona") && token && token.length > 0) {
        return NextResponse.redirect(new URL("/user/persona", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/user/:path*"],
}