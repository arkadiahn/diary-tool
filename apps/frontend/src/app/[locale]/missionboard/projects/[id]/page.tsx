import ProjectDetailView from "@/app/components/projectDetail";
import { getMissionboardProject } from "@/api/missionboard";

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const { data: project } = await getMissionboardProject(id);

    return (
		<ProjectDetailView data={project} />
    );
}
