import { auth } from "@/auth/server";
import AccountButton from "./accountButton";
import ProfileButton from "./profileButton";

export default async function AccountHandler() {
    const { session } = await auth();

    return (
        <>
            {session && <ProfileButton session={session} />}
            {session && <AccountButton type="logout" />}
            {!session && <AccountButton type="login" />}
        </>
    );
}
