import { getMissionMilestones } from "@/api/missionboard";
import TimeStepper from "../TimeStepper";

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
    );
}
