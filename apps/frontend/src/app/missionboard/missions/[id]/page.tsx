import MissionDetailView from "../../src/components/missionDetail";
import { getMission } from "@/api/missionboard";

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const { data: mission } = await getMission(id);

    return (
		<MissionDetailView data={mission} />
    );
}
