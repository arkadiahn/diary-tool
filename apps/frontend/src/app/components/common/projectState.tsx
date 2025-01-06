import { MissionboardProjectProjectState } from "@/api/missionboard";
import { Chip } from "@nextui-org/react";


export default function ProjectState({ state }: { state: MissionboardProjectProjectState }) {
    return (
        <Chip size="sm" className="text-xs" color={
            state === "active" ? "primary" : state === "completed" ? "success" : "danger"
        }>{state}</Chip>
    )
}
