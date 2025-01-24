export const buildLoginUrl = (redirectUri: string, params?: Record<string, string>) => {
	const urlParams = new URLSearchParams({
		client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
		redirect_uri: redirectUri,
		response_type: "code",
		...params
	});
	return `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${urlParams}`;
};

export const buildLogoutUrl = (redirectUri: string, params?: Record<string, string>) => {
	const urlParams = new URLSearchParams({
		client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
		post_logout_redirect_uri: redirectUri,
		...params
	});
	return `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${urlParams}`;
};
