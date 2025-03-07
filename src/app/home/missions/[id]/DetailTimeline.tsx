import { timestampToDate } from "@/api/utils";
import webClient from "@/api";

import CustomIcon from "@/components/CustomIcon";
import { CardBody, Chip } from "@heroui/react";
import { Card } from "@heroui/react";
import TimeStepper from "../TimeStepper";

/* ---------------------------------- Icons --------------------------------- */
import icCalendarEventFill from "@iconify/icons-ic/round-calendar-month";

interface TimelineProps {
    name: string;
}

export default async function DetailTimeline({ name }: TimelineProps) {
    const { missionMilestones } = await webClient.listMissionMilestones({ parent: name });

    const milestonesCount = missionMilestones.length;
    const completedMilestonesCount = missionMilestones.filter((milestone) => milestone.completed).length;

    if (milestonesCount === 0) {
        return <p className="text-default-500">No timeline found</p>;
    }

    return (
        <>
            <TimeStepper
                stepsCount={milestonesCount}
                currentStep={completedMilestonesCount}
                milestoneInfo={missionMilestones
                    .sort((a, b) => (timestampToDate(a.endTime)?.getTime() ?? 0) - (timestampToDate(b.endTime)?.getTime() ?? 0))
                    .map((milestone) => ({
                        description: milestone.description,
                        timestamp: timestampToDate(milestone.endTime)?.toLocaleString() ?? "",
                    }))}
            />
            <div className="mt-6 space-y-4">
                {missionMilestones?.map((milestone, index) => (
                    <Card key={milestone.name} className="border-1 border-default-100">
                        <CardBody className="flex flex-row items-center gap-4">
                            <div className="flex-none">
                                <Chip
                                    size="lg"
                                    variant="dot"
                                    color={
										milestone.completed ? "success" : "primary"
                                    }
                                >
                                    {index + 1}
                                </Chip>
                            </div>
                            <div className="flex-grow space-y-1">
                                <h4 className="text-medium font-semibold">{milestone.name}</h4>
                                <p className="text-small text-default-500">{milestone.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <CustomIcon icon={icCalendarEventFill} className="w-4 h-4 text-default-400" />
                                    <span className="text-small text-default-400">{timestampToDate(milestone.endTime)?.toLocaleString() ?? ""}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </>
    );
}
