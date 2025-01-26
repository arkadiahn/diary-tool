import DiaryOverview from "./src/components/layout/DiaryOverview";
import { auth } from "@/auth/server";

export default async function HomePage() {
	const session = await auth();
	if (session) {
		return <DiaryOverview session={session} />;
	}
	return <></>;
}
