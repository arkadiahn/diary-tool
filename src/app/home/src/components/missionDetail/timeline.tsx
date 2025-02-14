import { getMissionMilestones } from "@/api/missionboard";
import TimeStepper from "../missionView/timeStepper";

interface TimelineProps {
    name: string;
}

export default async function Timeline({ name }: TimelineProps) {
    const { data } = await getMissionMilestones(name.split("/").at(-1)!);

    const milestonesCount = data.length;
    const completedMilestonesCount = data.filter((milestone) => milestone.state === "completed").length;

    if (milestonesCount === 0) {
        return <p className="text-default-500">No timeline found</p>;
    }

    return (
        <TimeStepper
            stepsCount={milestonesCount}
            currentStep={completedMilestonesCount}
            milestoneInfo={data.map((milestone) => ({
                description: milestone.description,
                timestamp: milestone.end_time,
            }))}
        />
    );
}
