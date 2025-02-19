"use client";

import CustomIcon from "@/components/CustomIcon";
import { parseAbsolute } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

/* ---------------------------------- Icons --------------------------------- */
import CalendarIcon from "@iconify/icons-ic/baseline-calendar-month";

export default function DateComponent({ date }: { date: string }) {
    const { locale } = useLocale();

    return (
        <div className="bg-default-100 rounded-lg p-1 px-2 flex flex-row justify-between items-center">
            {parseAbsolute(date, "Europe/Berlin").toDate().toLocaleString(locale, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })}
            <CustomIcon className="text-default-500" icon={CalendarIcon} height={18} width={18} />
        </div>
    );
}
