import { SessionProvider } from "./client";
import { auth } from "./server";


/* -------------------------------------------------------------------------- */
/*                           SessionProviderWrapper                           */
/* -------------------------------------------------------------------------- */
export default async function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
	const session = await auth();

	return <SessionProvider initialSession={session}>{children}</SessionProvider>;
}
