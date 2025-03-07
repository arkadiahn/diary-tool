import webClient from "@/api";

import DetailTimeline from "./DetailTimeline";
import MissionDetails from "./MissionDetails";

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const mission = await webClient.getMission({ name: `missions/${id}` });
    const { missionAccounts } = await webClient.listMissionAccounts({ parent: mission.name });

    return (
        <MissionDetails
            mission={mission}
            timelineComponent={<DetailTimeline name={mission.name} />}
            accounts={missionAccounts}
        />
    );
}
