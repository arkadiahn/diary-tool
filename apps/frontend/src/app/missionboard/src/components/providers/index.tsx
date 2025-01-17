"use client";

import { configureAuth } from "@arkadia/cnauth";


export default function Providers({
    children
}: { children: React.ReactNode }) {
	configureAuth({
		baseUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
		baseApiUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth`,
	});

    return (children);
}
