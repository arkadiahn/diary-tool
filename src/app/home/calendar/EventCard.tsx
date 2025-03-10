"use client";

import type { Event } from "@arkadiahn/apis/intra/v1/event_pb";
import { timestampToDate } from "@/api/utils";

import CustomIcon from "@/components/CustomIcon";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";

/* ---------------------------------- Icons --------------------------------- */
import ClockIcon from "@iconify/icons-ic/round-access-time";
import CalendarIcon from "@iconify/icons-ic/round-calendar-month";
import MapPinIcon from "@iconify/icons-ic/round-map";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
// @todo fix locale to adjust to user's locale
export default function EventCard({ event }: { event: Event }) {
    const router = useRouter();

    const onEventClick = () => {
        router.push(`/calendar/${event.name.split("/").at(-1)}`);
    };

    return (
        <Card
            key={event.name}
            className="group"
            shadow="sm"
            isHoverable={true}
            isPressable={true}
            onPress={onEventClick}
        >
            <CardHeader className="flex gap-2 px-4 pt-4">
                <div className="flex flex-col items-start gap-1 flex-grow">
                    <h2 className="text-xl text-start font-medium line-clamp-1">{event.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-default-500 text-sm">
                        <div className="flex items-center gap-1">
                            <CustomIcon icon={CalendarIcon} className="w-3.5 h-3.5" width={14} />
                            <time>{timestampToDate(event.beginTime)?.toLocaleDateString("de-DE")}</time>
                        </div>
                        <div className="flex items-center gap-1">
                            <CustomIcon icon={ClockIcon} className="w-3.5 h-3.5" width={14} />
                            <span>
                                {timestampToDate(event.beginTime)?.toLocaleTimeString("de-DE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <Chip color="primary" variant="flat" size="sm" className="shrink-0">
                    {event.topic}
                </Chip>
            </CardHeader>
            <CardBody className="px-4 pb-4">
                {event.pictureUri && (
                    <img
                        src={event.pictureUri}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-large mb-2"
                    />
                )}
                <p className="text-default-600 text-sm line-clamp-2 mb-2">{event.shortDescription}</p>
                <div className="flex flex-wrap gap-2 text-default-500 text-sm">
                    {event.location && (
                        <div className="flex items-center gap-1">
                            <CustomIcon icon={MapPinIcon} className="w-3.5 h-3.5" width={14} />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    )}
                    {/* {event.link && (
                        <Link href={event.link} className="text-primary text-sm" showAnchorIcon={true} target="_blank">
                            Details
                        </Link>
                    )} */}
                </div>
            </CardBody>
        </Card>
    );
}
