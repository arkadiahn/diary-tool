import { getMissionboardProject, Project } from "@/api/missionboard";
import ProjectEdit from "@/app/components/projectEdit";

interface EditProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
	const { id } = await params;
	let project: Project | undefined = undefined;

	try {
		const { data } = await getMissionboardProject(id);
		project = data;
	} catch {} 

	return <ProjectEdit data={project!} />;
}
