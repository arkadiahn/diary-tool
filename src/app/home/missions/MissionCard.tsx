"use client";

import { Card, CardHeader, CardBody, Chip, CardFooter, Tooltip } from "@heroui/react";
import { likeMission, type MissionSummary } from "@/api/missionboard";
import CustomIcon from "@/components/CustomIcon";
import { useRouter } from "next/navigation";
import TimeStepper from "./TimeStepper";
import { useState } from "react";
import clsx from "clsx";

/* ---------------------------------- Icons --------------------------------- */
import UserGroupIcon from "@iconify/icons-ic/sharp-account-circle";
import HeartIcon from "@iconify/icons-solar/heart-bold";


export default function MissionCard({ mission }: { mission: MissionSummary }) {
	const [likes, setLikes] = useState(mission.like_count);
	const approved = mission.name !== "missions/m006"
	const rejected = mission.name === "missions/m007"
	const router = useRouter();

	const onLike = async () => {
		setLikes((prev) => prev + 1);
		await likeMission(mission.name);
	}

	return (
		<div className="relative w-full h-full">
			{(!approved || rejected) && (
				<div className="z-10 absolute h-full w-full top-0 right-0 flex items-center justify-center isolate opacity-100 cursor-not-allowed">
					<h3 className={clsx("text-xl font-medium text-yellow-600", {
						"text-red-600": rejected
					})}>
						{rejected ? "Mission rejected!" : "Mission under review..."}
					</h3>
				</div>
			)}
			<Card 
				className={clsx("group w-full h-full", {
					"bg-yellow-100": !approved,
					"bg-red-100": rejected
				})}
				isPressable={approved && !rejected}
				isDisabled={!approved || rejected}
				isHoverable={approved && !rejected}
				onPress={() => {
					if (approved && !rejected) {
						router.push(mission.name);
					}
				}}
			>
				<CardHeader className="flex justify-between items-start gap-3 pb-1">
					<h3 className="text-xl font-medium line-clamp-1 text-start">
						{mission.title}
					</h3>
					<Chip
						size="sm"
						variant="dot"
						radius="lg"
						color={
							mission.mission_state === "active" ? "primary" :
							mission.mission_state === "completed" ? "success" :
							"danger"
						}
					>
						{mission.mission_state}
					</Chip>
				</CardHeader>

				<CardBody className="pt-0 space-y-2">
					<p className="text-default-500 text-sm line-clamp-2 min-h-[38px]">
						{mission.description}
					</p>
					<div className="w-full h-[50px] space-y-1">
						<h4 className="text-xs font-medium text-default-500 flex items-center">Milestones</h4>
						{mission.milestones_count === 0 ? (
							<p className="text-default-500 text-sm">No milestones</p>
						) : (
							<TimeStepper stepsCount={mission.milestones_count} currentStep={mission.completed_milestones_count} />
						)}
					</div>
				</CardBody>

				<CardFooter className="flex justify-between items-center">
					<div className="flex items-center gap-1 text-default-500">
						<CustomIcon icon={UserGroupIcon} className="w-5 h-5" />
						<span className="text-sm">{mission.account_count}</span>
					</div>
					<div className="flex items-center gap-1">
						<span className="text-sm">{likes}</span>
						<Tooltip content="Like mission" placement="top" showArrow={true}>
							<div onClick={onLike}>
								<CustomIcon
									icon={HeartIcon} 
									className="w-6 h-6 text-red-500 hover:scale-110 transition-transform" 
								/>
							</div>
						</Tooltip>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
