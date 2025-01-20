import DiaryOverview from "../src/components/layout/DiaryOverview";
import { auth } from "@arkadia/cnauth/server";


export default async function EntriesPage() {
    // const session = await auth();
	const session = {
		user: {
			id: 1,
			nickName: "Mock User",
			email: "mock@example.com",
			imageURI: "",
			scopes: ["admin"]
		}
	}

	return <DiaryOverview session={session} />;
}
