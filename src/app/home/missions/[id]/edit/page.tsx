import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";
import webClient from "@/api";

import MissionEdit from "../../../src/components/missionEdit";

interface EditMissionPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditMissionPage({ params }: EditMissionPageProps) {
    const { id } = await params;
    let mission: Mission | undefined = undefined;

    try {
		mission = await webClient.getMission({
			name: `mission/${id}`
		});
    } catch {}

    return <MissionEdit data={mission!} />;
}
