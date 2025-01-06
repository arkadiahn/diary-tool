import { RouteHandlerCallback, Session, User } from "@/types";
import { redirect as redirectTo } from "next/navigation";
import { formatRedirectUrl } from "@/utils/helpers";
import { globalConfig } from "@/utils/config";
import { NextRequestWrapper } from "@/types";
import { NextRequest } from "next/server";
import { headers } from "next/headers";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
async function getSession(headers: Headers): Promise<Session | null> {
	try {
		const resp = await fetch(`${globalConfig.baseApiUrl}${globalConfig.sessionEndpoint}`, {
			headers: { 
				cookie: headers.get("cookie") ?? "",
				'Cache-Control': 'no-store, no-cache, must-revalidate',
				'Pragma': 'no-cache'
			},
			cache: "no-store"
		});

		if (!resp.ok) {
			if (resp.status === 401) {
				return null;
			}
			throw new Error(`Session fetch failed: ${resp.status}`);
		}

		const data = await resp.json();
		return {
			user: data as User,
		};
	} catch (error) {
		console.error("Failed to fetch session:", error);
		return null;
	}
}

function isReqWrapper(value: unknown): value is NextRequestWrapper | RouteHandlerCallback {
	if (!value || typeof value !== 'object') return false;
	if (typeof value === 'function') return true;
	return 'request' in value && value.request instanceof NextRequest;
}

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
export function signIn(provider: string, redirect: string) {
    const signUrl = `${globalConfig.baseApiUrl}${globalConfig.loginEndpoint}?${new URLSearchParams(
        {
            redirect: formatRedirectUrl(redirect),
			method: provider
        },
    )}`;
    redirectTo(signUrl);
}

export function signOut(redirect: string) {
    const signUrl = `${globalConfig.baseApiUrl}${globalConfig.signoutEndpoint}?${new URLSearchParams(
        {
            redirect: formatRedirectUrl(redirect),
        },
    )}`;
    redirectTo(signUrl);
}


export const auth: (
	// React Server Component
	((...args: []) => Promise<Session | null>)
	// (...args: [NextApiRequest, NextApiResponse]) => Promise<Session | null>) &
    // ((...args: [GetServerSidePropsContext]) => Promise<Session | null>) &
    // ((
    //     ...args: [
    //         (
    //             req: NextAuthRequest,
    //             ctx: AppRouteHandlerFnContext
    //         ) => ReturnType<AppRouteHandlerFn>,
    //     ]
    // ) => AppRouteHandlerFn
) = async (...args) => {
	// React Server Component
	if (!args.length) {
		const _headers = await headers();
		return await getSession(_headers);
	}

	// // middleware.ts inline
	// if (args[0] instanceof Request) {
	// 	// @todo implement
	// }

	// // middleware.ts wrapper/route.ts
	// if (isReqWrapper(args[0])) {
	// 	// @todo implement
	// }

	// // API Routes, getServerSideProps
	// // @todo implement

	return null;
}
