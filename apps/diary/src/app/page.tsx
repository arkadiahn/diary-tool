import DiaryPage from "@/components/layout/DiaryPage";
import { auth } from "@arkadia/cnauth/server";

export default async function HomePage() {
	const session = await auth();
	return <DiaryPage session={session} />;
}
