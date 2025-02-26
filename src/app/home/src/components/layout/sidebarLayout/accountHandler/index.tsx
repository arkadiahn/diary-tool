import { auth } from "@/auth/server";
import AccountButton from "./accountButton";
import ProfileButton from "./profileButton";

interface AccountHandlerProps {
    className?: string;
    forceSmall?: boolean;
}
export default async function AccountHandler({ className, forceSmall }: AccountHandlerProps) {
    const { session } = await auth({});

    return (
        <>
            {session && <ProfileButton session={session} className={className} forceSmall={forceSmall} />}
            {!session && <AccountButton type="login" className={className} />}
        </>
    );
}
