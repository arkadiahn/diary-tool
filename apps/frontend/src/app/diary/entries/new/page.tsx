import DiaryNew from "../src/components/layout/DiaryNew";
import { auth } from "@arkadia/cnauth/server";

export default async function HomePage() {
	const session = await auth();
	return <DiaryNew session={session} />;
}
