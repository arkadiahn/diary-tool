import { getEvents } from "@/api/missionboard";
import { ScrollShadow } from "@heroui/react";
import MainPageLayout from "../src/components/MainPageLayout";
import CalendarLayout from "./CalendarLayout";

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */
export default async function CalendarPage() {
    const { data: events } = await getEvents();

    return (
        <MainPageLayout title="Calendar" description="Find your next event">
            <ScrollShadow className="w-full flex-1 scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent pr-2">
                <CalendarLayout events={events} />
            </ScrollShadow>
        </MainPageLayout>
    );
}
