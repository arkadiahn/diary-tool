"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/prisma";


export async function handleDelete(formData: FormData) {
	await prisma.diary.delete({
		where: { id: formData.get("id") as string },
	});
	revalidatePath("/");
}

export async function handleGoalChange(formData: FormData) {
	const goals = Array.from(formData.entries()).filter(([key]) => key.startsWith("goal.")).map(([key, value]) => ({
		id: key.split(".")[1],
		completed: value === "",
	}));
	await prisma.diaryGoal.update({
		where: {
			id: goals[0].id,
		},
		data: {
			completed: goals[0].completed,
		},
	});
}
