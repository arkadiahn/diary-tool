import { Card } from "@heroui/react";

import type { Event } from "@/api/missionboard";

import EventCard from "./EventCard";
import EventGroup from "./EventGroup";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
const groupEventsByDate = (events: Event[]) => {
    const sortedEvents = [...events].sort(
        (a, b) => new Date(a.begin_time).getTime() - new Date(b.begin_time).getTime(),
    );
    return sortedEvents.reduce<Record<string, Event[]>>((groups, event) => {
        const date = new Date(event.begin_time).toLocaleDateString("de-DE");
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(event);
        return groups;
    }, {});
};

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
export default function CalendarLayout({ events }: { events: Event[] }) {
    const groupedEvents = groupEventsByDate(events);

    if (events.length === 0) {
        return (
            <Card className="text-center p-6 col-span-full">
                <p className="text-default-500">No upcoming events</p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 mx-auto">
            {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                <EventGroup date={date} key={date}>
                    {dateEvents.map((event) => (
                        <EventCard event={event} key={event.name} />
                    ))}
                </EventGroup>
            ))}
        </div>
    );
}
