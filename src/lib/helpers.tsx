import type { Diary } from "@/generated/prisma";

const getWeekNumber = (date: Date): number => {
    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    targetDate.setUTCDate(targetDate.getUTCDate() + 4 - (targetDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(targetDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((targetDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export const getHasEntryThisWeek = (diaries: Diary[]): boolean => {
    const sortedDiaries = diaries.sort((a, b) => a.entryTime.getTime() - b.entryTime.getTime());
    return (
        sortedDiaries.length > 0 &&
        getWeekNumber(sortedDiaries[sortedDiaries.length - 1].entryTime) === getWeekNumber(new Date())
    );
};

export const isEditable = (entry: Diary): boolean => {
    const now = new Date();
    const isBeforeMondayTenAM = now.getUTCDay() === 1 && now.getUTCHours() < 10;
    const entryWeek = getWeekNumber(entry.entryTime);
    const currentWeek = getWeekNumber(now);
    const effectiveCurrentWeek = isBeforeMondayTenAM ? currentWeek - 1 : currentWeek;

    return entryWeek >= effectiveCurrentWeek - 1;
};
