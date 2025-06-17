"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function handleDelete(formData: FormData) {
	const session = await auth();
	if (!session) {
		throw new Error("Unauthorized");
	}
	const diaryId = formData.get("id") as string;
	await prisma.diary.delete({
		where: { id: diaryId, accountId: session.user.sub },
	});
	revalidatePath("/");
}

export async function handleGoalChange(goalId: string, completed: boolean) {
    const session =  await auth();
	if (!session) {
		throw new Error("Unauthorized");
	}
	const goal = await prisma.diaryGoal.findUnique({
		where: { id: goalId },
		include: { diary: true }
	});
	if (goal?.diary.accountId !== session.user.sub) {
		throw new Error("Unauthorized")
	}
	await prisma.diaryGoal.update({
        where: {
            id: goalId,
        },
        data: {
            completed: completed,
        },
    });
    revalidatePath("/");
}
