import { auth } from "@/auth/server";
import DiaryOverview from "./src/components/layout/DiaryOverview";

export default async function HomePage() {
    const { session } = await auth();

    return <DiaryOverview session={session} />;
}
