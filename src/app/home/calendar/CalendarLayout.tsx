import { timestampToDate } from "@/api/utils";
import type { Event } from "@arkadiahn/apis/intra/v1/event_pb";

import { Card } from "@heroui/react";

import EventCard from "./EventCard";
import EventGroup from "./EventGroup";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
const groupEventsByDate = (events: Event[]) => {
    const sortedEvents = [...events].sort(
        (a, b) => (timestampToDate(a.beginTime)?.getTime() ?? 0) - (timestampToDate(b.beginTime)?.getTime() ?? 0),
    );
    return sortedEvents.reduce<Record<string, Event[]>>((groups, event) => {
        const date = timestampToDate(event.beginTime)?.toLocaleDateString("de-DE");
        if (!date) {
            return groups;
        }
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
            <div className="text-center p-6 col-span-full">
                <p className="text-default-500 text-xl">No upcoming events</p>
            </div>
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
