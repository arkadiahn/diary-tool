"use client";

import { parseAsString, useQueryState } from 'nuqs';
import { AUTH_PROVIDERS } from "@/constants/auth";
import { LoginButton } from "./LoginButton";


export default function AuthProviders() {
	const [redirectUrl] = useQueryState("redirect", parseAsString);

    return (
        <div className="flex flex-col gap-2">
            {AUTH_PROVIDERS.map((provider) => (
                <LoginButton key={provider.name} redirectUrl={redirectUrl || undefined} {...provider} />
            ))}
        </div>
    );
}
