import ProfileButton from "./profileButton";
import { auth } from "@/auth/server";
import LoginButton from "./login";

export default async function AccountHandler() {
	const { session } = await auth({});

	if (!session) {
		return (
			<LoginButton />
		)
	}

	return (
		<ProfileButton session={session} />
	)
}
