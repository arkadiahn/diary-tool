import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";
import MissionDetailView from "./missionDetail";
import Timeline from "./timeline";

interface MissionDetailProps {
    data: Mission;
}
export default function MissionDetail({ data }: MissionDetailProps) {
    return <MissionDetailView data={data} timelineComponent={<Timeline name={data.name} />} />;
}
