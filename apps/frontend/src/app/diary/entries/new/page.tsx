import DiaryNew from "../../src/components/layout/DiaryNew";
import { auth } from "@arkadia/cnauth/server";

export default async function HomePage() {
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
	return <DiaryNew session={session} />;
}
