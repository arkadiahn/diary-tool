import { createClient, type Interceptor, ConnectError, Code } from "@connectrpc/connect";
import { IntraService } from "@arkadiahn/apis/intra/v1/intra_service_pb";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import Cookies from "js-cookie";
import * as jose from "jose";



/* ------------------------ Authorization Interceptor ----------------------- */
const authenticator: Interceptor = (next) => async (req) => {
	if (typeof window === "undefined") {
		const cookies = require("next/headers").cookies;
		req.header.set("Authorization", `Bearer ${
			(await cookies()).get("session")?.value
		}`);
	} else {
		req.header.set("Authorization", `Bearer ${
			Cookies.get("session")
		}`);
	}
	return next(req);
}

/* ----------------------------- Session Handler ---------------------------- */
const sessionHandler: Interceptor = (next) => async (req) => {
	try {
		return next(req);
	} catch (error) {
		if (error instanceof ConnectError && error.code === Code.Unauthenticated) {
			try {
				const decodedToken = await jose.decodeJwt(Cookies.get("session") ?? "");
				if (decodedToken) {
					const sessionResponse = await fetch("/api/session", {
						credentials: "include",
						cache: "no-store",
					});
					if (sessionResponse.status !== 200) {
						throw new Error("Session refresh failed");
					} else {
						return next(req);
					}
				}
			} catch {
				window.location.href = "/";
			}
		}
		throw error;
	}
}

/* --------------------------------- Client --------------------------------- */
const webTransport = createGrpcWebTransport({
	baseUrl: typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build" 
		? process.env.BACKEND_URL 
		: process.env.NEXT_PUBLIC_BACKEND_URL,
	useBinaryFormat: true,
	interceptors: [sessionHandler, authenticator]
});
const webClient = createClient(IntraService, webTransport);

export default webClient;
