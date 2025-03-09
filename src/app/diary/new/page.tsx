import { auth } from "@/auth/server";
import DiaryNew from "../src/components/layout/DiaryNew";
import webClient from "@/api";

export default async function NewDiaryPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
    const { session } = await auth({});
    let initialDiary;

    if ((await searchParams).edit) {
            initialDiary = await webClient.getDiary({
            name: (await searchParams).edit,
        });
    }

    return <DiaryNew session={session} initialDiary={initialDiary} />;
}
