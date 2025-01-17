import { MissionMissionState } from "@/api/missionboard";
import { Chip } from "@heroui/react";


export default function MissionState({ state }: { state: MissionMissionState }) {
    return (
        <Chip size="sm" className="text-xs" color={
            state === "active" ? "primary" : state === "completed" ? "success" : "danger"
        }>{state}</Chip>
    )
}
