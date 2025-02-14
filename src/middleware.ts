import { type NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./auth/server";

// @todo implement logging

/* -------------------------------------------------------------------------- */
/*                                 Middleware                                 */
/* -------------------------------------------------------------------------- */
export default authMiddleware((request: NextRequest) => {
    if (request.nextUrl.pathname === "/health") {
        return NextResponse.json({ status: "ok" });
    }

    let host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    host = host?.replace(process.env.TOP_LEVEL_DOMAIN, "") ?? host;
    const subdomains = host?.includes(".") ? host?.split(".") : [];

    const url = request.nextUrl.clone();
    if (subdomains.length > 1) {
        url.pathname = `/${subdomains[0]}${url.pathname}`;
    } else {
        url.pathname = `/home${url.pathname}`;
    }
    return NextResponse.rewrite(url);
});

export const config = {
    matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
