import DiaryOverview from "../src/components/layout/DiaryOverview";
import { auth } from "@arkadia/cnauth/server";


export default async function EntriesPage() {
    const session = await auth();
	console.log(session);

	return <DiaryOverview session={session} />;
}
