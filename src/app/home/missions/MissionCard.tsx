"use client";

import { type MissionSummary, likeMission } from "@/api/missionboard";
import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import MissionState from "./MissionState";
import TimeStepper from "./TimeStepper";

interface MissionCardProps {
    data: MissionSummary;
}
export default function MissionCard({ data }: MissionCardProps) {
    const router = useRouter();

    const onLike = async () => {
        await likeMission(data.name.split("/").at(-1) ?? "");
    };

    const _onShare = () => {
        const url = `${window.location.origin}${data.name}`;
        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    return (
        <Card className="w-[300px]" isPressable={true} disableRipple={true} onPress={() => router.push(data.name)}>
            <CardBody className="space-y-4 flex flex-col items-center justify-center px-8">
                <div className="w-full h-14 flex justify-between items-center mb-1 gap-2">
                    <h2 className="text-2xl font-medium line-clamp-2">{data.title}</h2>
                    <MissionState state={data.mission_state} />
                </div>
                <div className="w-full h-[46px] space-y-1">
                    <h4 className="text-xs font-medium text-default-500 flex items-center">Milestones</h4>
                    {data.milestones_count === 0 ? (
                        <p className="text-default-500">No milestones</p>
                    ) : (
                        <TimeStepper stepsCount={data.milestones_count} currentStep={data.completed_milestones_count} />
                    )}
                </div>
                <div className="w-full h-[72px] space-y-1">
                    <h4 className="text-xs font-medium text-default-500 line-clamp-2">Description</h4>
                    <p className="max-w-full text-default-600 leading-relaxed">{data.description}</p>
                </div>
                <div className="w-full flex justify-between">
                    <div>
                        <h4 className="text-xs font-medium text-default-500">Progress</h4>
                        <h3 className="text-xl font-medium">
                            {data.milestones_count === 0
                                ? "0"
                                : Math.round((data.completed_milestones_count / data.milestones_count) * 100)}
                            %
                        </h3>
                    </div>
                    <div>
                        <h4 className="text-xs font-medium text-default-500">Likes</h4>
                        <div className="flex items-center gap-1">
                            <Button
                                as="div"
                                size="sm"
                                variant="light"
                                aria-label="Like mission"
                                className="!p-3"
                                onPress={onLike}
                            >
                                <span className="text-md">{data.like_count}</span>
                                <span className="text-lg">👍</span>
                            </Button>
                            {/* @todo implement nice share button */}
                            {/* <Button
								as="div"
								size="sm"
								variant="light"
								aria-label="Share mission"
								className="!p-3"
								onPress={onShare}
							>
								<span className="text-lg">📤</span>
							</Button> */}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
