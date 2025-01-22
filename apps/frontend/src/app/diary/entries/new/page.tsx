import DiaryNew from "../../src/components/layout/DiaryNew";
import { auth } from "@/auth";

export default async function HomePage() {
	const session = await auth();
	// const session = {
	// 	user: {
	// 		id: 1,
	// 		nickName: "Mock User",
	// 		email: "mock@example.com",
	// 		imageURI: "",
	// 		scopes: [""]
	// 	}
	// }

	return <DiaryNew session={session} />;
}
