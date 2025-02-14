import { getDiary } from '@/api/missionboard';
import DiaryNew from '../src/components/layout/DiaryNew';
import { auth } from "@/auth/server";

export default async function NewDiaryPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
	const { session } = await auth();
	let initialDiary;
	
	if ((await searchParams).edit) {
		const [_, accountId, __, diaryId] = (await searchParams).edit?.split('/') ?? [];
		if (accountId && diaryId) {
			const response = await getDiary(accountId, diaryId);
			initialDiary = response.data;
		}
	}

	return <DiaryNew session={session} initialDiary={initialDiary} />;
}
