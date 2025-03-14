import { Mission_State } from "@arkadiahn/apis/intra/v1/mission_pb";
import { Chip } from "@heroui/react";

export default function MissionState({ state }: { state: Mission_State }) {
    return (
        <Chip
            size="sm"
            className="text-xs"
            color={
                state === Mission_State.ACTIVE ? "primary" : state === Mission_State.COMPLETED ? "success" : "danger"
            }
        >
            {state}
        </Chip>
    );
}
