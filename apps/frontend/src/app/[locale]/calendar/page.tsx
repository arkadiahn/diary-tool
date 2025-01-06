import { getEvents } from "@/api/missionboard";
import { Card, CardHeader, CardBody, Chip, Divider, Link, ScrollShadow } from "@nextui-org/react";

import MapPinIcon from "@iconify/icons-ic/round-map";
import CalendarIcon from "@iconify/icons-ic/round-calendar-month";
import ClockIcon from "@iconify/icons-ic/round-access-time";
import CustomIcon from "@/app/components/common/CustomIcon";


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
			{/* <main className="flex-1 flex flex-col gap-6 px-4 max-w-7xl mx-auto w-full"> */}
				<ScrollShadow className="scrollbar scrollbar-thumb-default-300 scrollbar-track-transparent px-4 space-y-4 py-4">
					{events.map((event) => (
						<Card 
							key={event.name}
							className="group"
							shadow="sm"
							isHoverable={false}
						>
							<CardHeader className="flex gap-3 px-6 pt-6">
								<div className="flex flex-col gap-1 flex-grow">
									<h2 className="text-2xl font-bold">{event.title}</h2>
									<div className="flex items-center gap-2 text-default-500">
										<CustomIcon icon={CalendarIcon} className="w-4 h-4" width={16}/>
										<time>{new Date(event.begin_time).toLocaleDateString()}</time>
										<CustomIcon icon={ClockIcon} className="w-4 h-4 ml-4" width={16}/>
										<span>
											{new Date(event.begin_time).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
												hour12: true
											})}
											{' - '}
											{new Date(event.end_time).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
												hour12: true
											})}
										</span>
									</div>
								</div>
								<Chip
									color="primary"
									variant="flat"
									size="sm"
								>
									{event.topic}
								</Chip>
							</CardHeader>
							<Divider className="my-4" />
							<CardBody className="px-6 pb-6">
								{event.picture_uri && (
									<img 
										src={event.picture_uri} 
										alt={event.title}
										className="w-full h-48 object-cover rounded-lg mb-4"
									/>
								)}
								<p className="text-default-600 mb-4">{event.description}</p>
								<div className="flex flex-wrap gap-4 text-default-500">
									{event.location && (
										<div className="flex items-center gap-2">
											<CustomIcon icon={MapPinIcon} className="w-4 h-4" width={16}/>
											<span>{event.location}</span>
										</div>
									)}
									{event.link && (
										<Link 
											href={event.link}
											className="text-primary"
											showAnchorIcon
											target="_blank"
										>
											Event Details
										</Link>
									)}
								</div>
							</CardBody>
						</Card>
					))}
					{events.length === 0 && (
						<Card className="text-center p-8">
							<p className="text-default-500">No upcoming events</p>
						</Card>
					)}
				</ScrollShadow>
			</main>
		</>
	)
}
