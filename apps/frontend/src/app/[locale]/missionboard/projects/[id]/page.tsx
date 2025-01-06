import ProjectDetailView from "@/app/components/projectDetail";
import { getMissionboardProject } from "@/api/missionboard";


export default async function ProjectPage({ params }: { params: { id: string; } }) {
    const { id } = await params;
    const { data: project } = await getMissionboardProject(id);

    return (
		<ProjectDetailView data={project} />
    );
}
