import { Card, CardBody, CardHeader, Chip, Link } from "@nextui-org/react";
import CustomIcon from "@/components/CustomIcon";
import { Event } from "@/api/missionboard";

/* ---------------------------------- Icons --------------------------------- */
import CalendarIcon from "@iconify/icons-ic/round-calendar-month";
import ClockIcon from "@iconify/icons-ic/round-access-time";
import MapPinIcon from "@iconify/icons-ic/round-map";


/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface EventCardProps {
	event: Event;
}


/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
export default function EventCard({ event }: EventCardProps) {
	return (
		<Card
			key={event.name}
			className="group"
			shadow="sm"
			isHoverable={false}
		>
			<CardHeader className="flex gap-2 px-4 pt-4">
				<div className="flex flex-col gap-1 flex-grow">
					<h2 className="text-xl font-bold line-clamp-1">{event.title}</h2>
					<div className="flex flex-wrap items-center gap-2 text-default-500 text-sm">
						<div className="flex items-center gap-1">
							<CustomIcon icon={CalendarIcon} className="w-3.5 h-3.5" width={14}/>
							<time>{new Date(event.begin_time).toLocaleDateString()}</time>
						</div>
						<div className="flex items-center gap-1">
							<CustomIcon icon={ClockIcon} className="w-3.5 h-3.5" width={14}/>
							<span>
								{new Date(event.begin_time).toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
									hour12: true
								})}
							</span>
						</div>
					</div>
				</div>
				<Chip
					color="primary"
					variant="flat"
					size="sm"
					className="shrink-0"
				>
					{event.topic}
				</Chip>
			</CardHeader>
			<CardBody className="px-4 pb-4">
				{event.picture_uri && (
					<img 
						src={event.picture_uri} 
						alt={event.title}
						className="w-full h-32 object-cover rounded-lg mb-2"
					/>
				)}
				<p className="text-default-600 text-sm line-clamp-2 mb-2">{event.description}</p>
				<div className="flex flex-wrap gap-2 text-default-500 text-sm">
					{event.location && (
						<div className="flex items-center gap-1">
							<CustomIcon icon={MapPinIcon} className="w-3.5 h-3.5" width={14}/>
							<span className="line-clamp-1">{event.location}</span>
						</div>
					)}
					{event.link && (
						<Link
							href={event.link}
							className="text-primary text-sm"
							showAnchorIcon
							target="_blank"
						>
							Details
						</Link>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
