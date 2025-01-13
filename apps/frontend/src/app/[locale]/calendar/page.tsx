import MainPageLayout from "@/app/layout/mainPageLayout";
import CalendarLayout from "./layout/calendarLayout";
import { ScrollShadow } from "@nextui-org/react";
import { getEvents } from "@/api/missionboard";


/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */
export default async function CalendarPage() {
	const { data: events } = await getEvents();

	return (
		<MainPageLayout title="Calendar" description="Find your next event">
			<ScrollShadow className="w-full flex-1 scrollbar scrollbar-thumb-default-300 scrollbar-track-transparent pb-4 px-4">
				<CalendarLayout events={events} />
			</ScrollShadow>
		</MainPageLayout>
	)
}
