import DiaryOverview from "./src/components/layout/DiaryOverview";
import { auth } from "@/auth";

export default async function HomePage() {
	const session = await auth();

    return <DiaryOverview session={session} />;
}
