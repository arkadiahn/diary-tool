import ProfileButton from "./profileButton";
import AccountButton from "./accountButton";
import { auth } from "@/auth/server";


export default async function AccountHandler() {
	const { session } = await auth();

	return (
		<>
			{session && (
				<ProfileButton session={session} />
            )}
			{session && <AccountButton type="logout" />}
			{!session && <AccountButton type="login" />}
		</>
    );
}
