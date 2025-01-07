import CalendarLayout from "./layout/calendarLayout";
import { ScrollShadow } from "@nextui-org/react";
import { getEvents } from "@/api/missionboard";


/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */
export default async function CalendarPage() {
	const { data: events } = await getEvents();

	return (
		<>
			<header className="mb-8">
				<h1 className="text-4xl md:text-7xl font-bold text-center">
					Upcoming Events
				</h1>
			</header>
			<main className="flex-1 flex flex-col overflow-hidden">
				<ScrollShadow className="scrollbar scrollbar-thumb-default-300 scrollbar-track-transparent px-4 py-4">
					<CalendarLayout events={events} />
				</ScrollShadow>
			</main>
		</>
	)
}
