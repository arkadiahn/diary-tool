import MissionDetailView from "./missionDetail";
import { Mission } from "@/api/missionboard";
import Timeline from "./timeline";

interface MissionDetailProps {
    data: Mission;
}
export default function MissionDetail({ data }: MissionDetailProps) {
    return (
		<MissionDetailView
			data={data}
			timelineComponent={<Timeline name={data.name} />}
		/>
	);
}

