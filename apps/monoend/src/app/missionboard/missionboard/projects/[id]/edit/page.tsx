import MissionEdit from "@/app/missionboard/src/components/missionEdit";
import { getMission, Mission } from "@/api/missionboard";

interface EditMissionPageProps {
    params: Promise<{	
        id: string;
    }>;
}

export default async function EditMissionPage({ params }: EditMissionPageProps) {
	const { id } = await params;
	let mission: Mission | undefined = undefined;

	try {
		const { data } = await getMission(id);
		mission = data;
	} catch {} 

	return <MissionEdit data={mission!} />;
}
