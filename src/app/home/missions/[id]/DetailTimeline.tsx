import { getMissionMilestones } from "@/api/missionboard";
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
    const { data: milestones } = await getMissionMilestones(name);

    const milestonesCount = milestones.length;
    const completedMilestonesCount = milestones.filter((milestone) => milestone.state === "completed").length;

    if (milestonesCount === 0) {
        return <p className="text-default-500">No timeline found</p>;
    }

    return (
        <>
            <TimeStepper
                stepsCount={milestonesCount}
                currentStep={completedMilestonesCount}
                milestoneInfo={milestones
                    .sort((a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime())
                    .map((milestone) => ({
                        description: milestone.description,
                        timestamp: milestone.end_time,
                    }))}
            />
            <div className="mt-6 space-y-4">
                {milestones?.map((milestone, index) => (
                    <Card key={index} className="border-1 border-default-100">
                        <CardBody className="flex flex-row items-center gap-4">
                            <div className="flex-none">
                                <Chip
                                    size="lg"
                                    variant="dot"
                                    color={
                                        milestone.state === "completed"
                                            ? "success"
                                            : milestone.state === "in progress"
                                              ? "primary"
                                              : milestone.state === "failed"
                                                ? "danger"
                                                : "default"
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
                                    <span className="text-small text-default-400">{milestone.end_time}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </>
    );
}
