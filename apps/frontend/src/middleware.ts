import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export default function middleware(request: NextRequest) {
	const host = request.headers.get("host");
	const subdomain = host?.includes(".") ? host?.split(".")?.[0] : null;

	if (subdomain) {
		const url = request.nextUrl.clone();
		url.pathname = `/${subdomain}${url.pathname}`;
		return NextResponse.rewrite(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
