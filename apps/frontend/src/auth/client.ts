import { buildLoginUrl, buildLogoutUrl } from "./helpers";

export const signIn = () => {
	window.location.href = buildLoginUrl(window.location.href);
}

export const signOut = () => {
	window.location.href = buildLogoutUrl(window.location.href);
}
