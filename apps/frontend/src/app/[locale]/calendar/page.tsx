import { Card, CardHeader, CardBody, Chip, Link, ScrollShadow } from "@nextui-org/react";
import { getEvents } from "@/api/missionboard";

import CalendarIcon from "@iconify/icons-ic/round-calendar-month";
import CustomIcon from "@/app/components/common/CustomIcon";
import ClockIcon from "@iconify/icons-ic/round-access-time";
import MapPinIcon from "@iconify/icons-ic/round-map";


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
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
						{events.map((event) => (
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
						))}
						{events.length === 0 && (
							<Card className="text-center p-6 col-span-full">
								<p className="text-default-500">No upcoming events</p>
							</Card>
						)}
					</div>
				</ScrollShadow>
			</main>
		</>
	)
}
