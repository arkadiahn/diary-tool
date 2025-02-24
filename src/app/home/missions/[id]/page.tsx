import { getMission, getMissionAccounts } from "@/api/missionboard";
import DetailTimeline from "./DetailTimeline";
import MissionDetails from "./MissionDetails";

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const { data: mission } = await getMission(id);
    const { data: accounts } = await getMissionAccounts(id);

    return (
        <MissionDetails
            mission={mission}
            timelineComponent={<DetailTimeline name={mission.name} />}
            accounts={accounts}
        />
    );
}
