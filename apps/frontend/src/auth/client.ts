export const signIn = () => {
	const params = new URLSearchParams({
		client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
		redirect_uri: window.location.href,
		response_type: "code",
		scope: "diary.read diary.write diary.admin"
	});
	window.location.href = `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${params}`;
}
