import webClient from "@/api";
import { MissionMilestone_State } from "@arkadiahn/apis/intra/v1/mission_milestone_pb";

import { timestampToDate } from "@/api/utils";
import TimeStepper from "../../../missions/TimeStepper";

interface TimelineProps {
    name: string;
}

export default async function Timeline({ name }: TimelineProps) {
    const data = await webClient.listMissionMilestones({
        parent: `mission/${name}`,
    });

    const milestonesCount = data.missionMilestones.length;
    const completedMilestonesCount = data.missionMilestones.filter(
        (milestone) => milestone.state === MissionMilestone_State.COMPLETED,
    ).length;

    if (milestonesCount === 0) {
        return <p className="text-default-500">No timeline found</p>;
    }

    return (
        <TimeStepper
            stepsCount={milestonesCount}
            currentStep={completedMilestonesCount}
            milestoneInfo={data.missionMilestones.map((milestone) => ({
                description: milestone.description,
                timestamp: timestampToDate(milestone.endTime)?.toISOString() ?? "",
            }))}
        />
    );
}
