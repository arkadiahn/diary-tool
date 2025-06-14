"use server";

import prisma from "@/prisma";
import { revalidatePath } from "next/cache";

export async function handleDelete(formData: FormData) {
    // @todo protect delete only for diary owner
    await prisma.diary.delete({
        where: { id: formData.get("id") as string },
    });
    revalidatePath("/");
}

export async function handleGoalChange(goalId: string, completed: boolean) {
    // @todo protect diary goal change only for diary owner
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
