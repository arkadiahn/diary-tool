import ProjectDetailView from "./projectDetail";
import { Project } from "@/api/missionboard";
import Timeline from "./timeline";

interface ProjectDetailProps {
    data: Project;
}
export default function ProjectDetail({ data }: ProjectDetailProps) {
    return (
		<ProjectDetailView
			data={data}
			timelineComponent={<Timeline name={data.name} />}
		/>
	);
}

