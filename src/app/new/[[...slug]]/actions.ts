"use server";

import type { Prisma } from "@/generated/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/prisma";


type DiaryWithGoals = Prisma.DiaryGetPayload<{
	include: { goals: true }
}>;

export async function handleSubmit(entry: DiaryWithGoals | null, formData: FormData) {
	const session = await auth();
	// @todo do this error/success handling correctly
	if (!session) {
		throw new Error("You must be logged in to create an entry");
	}

	if (!entry) {
		const newEntry = await prisma.diary.create({
			data: {
				project: formData.get("project") as string,
				accountId: session?.user.sub || "",
				entryTime: new Date(),
				motivation: Number(formData.get("motivation")) as number,
				learnings: formData.get("learnings") as string,
				obstacles: formData.get("obstacles") as string,
				completionWeeks: Number(formData.get("weeks")) as number,
			},
		});
		await prisma.diaryGoal.createMany({
			data: Array.from(formData.entries())
				.filter(([key]) => key.startsWith("goal."))
				.map(([_, value]) => ({
					diaryId: newEntry.id,
					title: value as string,
					completed: false
				}))
		});
	} else {
		await prisma.diary.update({
			where: { id: entry.id },
			data: {
				project: formData.get("project") as string,
				motivation: Number(formData.get("motivation")) as number,
				learnings: formData.get("learnings") as string,
				obstacles: formData.get("obstacles") as string,
				completionWeeks: Number(formData.get("weeks")) as number,
			},
		});
		await Promise.all(
			Array.from(formData.entries())
				.filter(([key]) => key.startsWith("goal."))
				.map(([key, value]) =>
					prisma.diaryGoal.update({
						where: { id: key.split(".")[1] },
						data: { title: value as string }
					})
				)
		);
	}

	redirect("/");
};