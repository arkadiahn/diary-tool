"use client";

import { configureAuth } from "@arkadia/cnauth";


export function Providers({ children }: { children: React.ReactNode }) {
	configureAuth({
		baseUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
		baseApiUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth`,
		loginEndpoint: "/login" + (process.env.NODE_ENV === "development" ? "/mock" : "")
	});

    return (children);
}
