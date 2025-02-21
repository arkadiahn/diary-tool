"use client";

import { type MissionSummary, likeMission } from "@/api/missionboard";
import CustomIcon from "@/components/CustomIcon";
import { Card, CardBody, CardFooter, CardHeader, Chip, Tooltip } from "@heroui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TimeStepper from "./TimeStepper";

/* ---------------------------------- Icons --------------------------------- */
import UserGroupIcon from "@iconify/icons-ic/sharp-account-circle";
import HeartIcon from "@iconify/icons-solar/heart-bold";

export default function MissionCard({ mission }: { mission: MissionSummary }) {
    const [likes, setLikes] = useState(mission.like_count);
    const rejected = mission.approval_state === "rejected";
    const approved = mission.approval_state === "approved";
    const pending = mission.approval_state === "pending";
    const router = useRouter();

    const onLike = async () => {
        setLikes((prev) => prev + 1);
        await likeMission(mission.name);
    };

    return (
        <div className="relative w-full h-full">
            {!approved && (
                <div className="z-10 absolute h-full w-full top-0 right-0 flex items-center justify-center isolate opacity-100 cursor-not-allowed">
                    <h3
                        className={clsx("text-xl font-medium", {
                            "text-red-600": rejected,
                            "text-yellow-600": pending,
                        })}
                    >
                        {rejected ? "Mission rejected!" : "Mission under review..."}
                    </h3>
                </div>
            )}
            <Card
                className={clsx("group w-full h-full", {
                    "!opacity-25": !approved,
                })}
                isPressable={approved}
                isDisabled={!approved}
                isHoverable={approved}
                onPress={() => {
                    if (approved) {
                        router.push(mission.name);
                    }
                }}
                role="presentation"
                as="div"
            >
                <CardHeader className="flex justify-between items-start gap-3 pb-3">
                    <h3 className="text-xl font-medium line-clamp-1 text-start">{mission.title}</h3>
                    <Chip
                        size="sm"
                        variant="dot"
                        radius="lg"
                        color={
                            mission.mission_state === "active"
                                ? "primary"
                                : mission.mission_state === "completed"
                                  ? "success"
                                  : "danger"
                        }
                    >
                        {mission.mission_state}
                    </Chip>
                </CardHeader>

                <CardBody className="pt-0 pb-3 space-y-2">
                    <p className="text-default-500 text-sm line-clamp-2 min-h-[38px]">{mission.description}</p>
                    <div className="w-full h-[50px] space-y-1">
                        <h4 className="text-xs font-medium text-default-500 flex items-center">Milestones</h4>
                        {mission.milestones_count === 0 ? (
                            <p className="text-default-500 text-sm">No milestones</p>
                        ) : (
                            <TimeStepper
                                stepsCount={mission.milestones_count}
                                currentStep={mission.completed_milestones_count}
                            />
                        )}
                    </div>
                </CardBody>

                <CardFooter className="flex justify-between items-center pt-0">
                    <div className="flex items-center gap-1 text-default-500">
                        <CustomIcon icon={UserGroupIcon} className="w-5 h-5" />
                        <span className="text-sm">{mission.account_count}</span>
                    </div>
                    <button
                        className="hover:scale-110 active:scale-95 transition-transform flex items-center gap-1"
                        onClick={onLike}
                        onKeyDown={(e) => {
                            if (e.key !== "Tab") {
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            if (e.key === "Enter" || e.key === " ") {
                                onLike();
                            }
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        aria-label="Like"
                    >
                        <span className="text-sm">{likes}</span>
                        <Tooltip content="Like mission" placement="top" showArrow={true}>
                            <CustomIcon icon={HeartIcon} width={26} height={26} className="text-red-500" />
                        </Tooltip>
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
}
