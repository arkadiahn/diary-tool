import { createI18nMiddleware } from "next-international/middleware";
import type { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
    locales: process.env.NEXT_PUBLIC_LOCALES?.split(",") || [],
    defaultLocale: process.env.NEXT_DEFAULT_LOCALE || "en-US",
    urlMappingStrategy: "rewriteDefault",
});

export function middleware(request: NextRequest) {
    return I18nMiddleware(request);
}

export const config = {
    matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
