import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const subdomains = ["diary", "portal"];

export default function middleware(request: NextRequest) {
	const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
	const requestSubdomains = request.headers.get("host")?.split(".") ?? [];

	console.log(pathSegments, requestSubdomains);

	if (
		pathSegments?.length == 1 && // only one path segment
		requestSubdomains?.length > 0 && // has subdomain
		subdomains.includes(requestSubdomains[0]) && // subdomain is valid
		subdomains[0] == pathSegments[0] // subdomain is the same as the first path segment
	) {
		console.log("rewrite to", `/_not-found`);
		return NextResponse.rewrite(new URL("/_not-found", request.url));
	} else if (
		subdomains?.includes(requestSubdomains[0]) // subdomain is valid
	) {
		console.log("rewrite to", `/${requestSubdomains[0]}`);
		return NextResponse.rewrite(new URL(`/${requestSubdomains[0]}`, request.url));
	}

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
