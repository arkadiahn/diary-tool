import { getMissionboardProjects, ProjectSummaryArray } from "@/api/missionboard";
import MissionView from "./view";


export default async function MissionViewWrapper() {
	const data = await getMissionboardProjects({
		format: "summary"
	});

    return (
        <MissionView 
			projects={data.data as ProjectSummaryArray}
		/>
    );
}
