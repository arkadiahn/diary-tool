import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";
import { Mission_State } from "@arkadiahn/apis/intra/v1/mission_pb";
import { Code, ConnectError } from "@connectrpc/connect";

import { useSession } from "@/auth/client";
import CustomIcon from "@/components/CustomIcon";
import { Button } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import webClient from "@/api";
/* ---------------------------------- Icons --------------------------------- */
import icLockClock from "@iconify/icons-ic/baseline-lock-clock";
import icCheckFill from "@iconify/icons-ri/check-fill";

interface JoinMissionButtonProps {
    mission: Mission;
}
export default function JoinMissionButton({ mission }: JoinMissionButtonProps) {
    const [state, setState] = useState<"loading" | "joined" | "not_joined" | "awaiting_approval">("loading");
    const { session } = useSession();

    const fetchMissionStatus = useCallback(async () => {
        if (!session || mission.state === Mission_State.COMPLETED) {
            return;
        }

        try {
            const { missionAccounts } = await webClient.listMissionAccounts({
                filter: `account="accounts/${session.user.id}"`,
                parent: mission.name,
                pageSize: 1,
            });
            const missionAccount = missionAccounts[0];

            setState(!missionAccount ? "not_joined" : missionAccount.approved ? "joined" : "awaiting_approval");
        } catch {
            toast.error("Failed to fetch mission status");
            setState("not_joined");
        }
    }, [session, mission.name, mission.state]);

    useEffect(() => {
        fetchMissionStatus();
    }, [fetchMissionStatus]);

    const handleJoinMission = async () => {
        if (session) {
            setState("awaiting_approval");
            try {
                await webClient.createMissionAccount({
                    parent: mission.name,
                    missionAccount: {
                        account: `accounts/${session.user.id}`,
                    },
                });
            } catch (error) {
                if (error instanceof ConnectError && error.code === Code.AlreadyExists) {
                    toast.error("You are already a member of this mission");
                    fetchMissionStatus();
                } else {
                    toast.error("Failed to join mission");
                    setState("not_joined");
                }
            }
        }
    };

    if (!session || mission.state === Mission_State.COMPLETED) {
        return null;
    }

    return (
        <Button
            isLoading={state === "loading"}
            isDisabled={state === "awaiting_approval" || state === "joined"}
            onPress={handleJoinMission}
            color={state === "joined" ? "success" : state === "awaiting_approval" ? "warning" : "primary"}
        >
            {state === "joined" && <CustomIcon icon={icCheckFill} className="w-5 h-5" />}
            {state === "awaiting_approval" && <CustomIcon icon={icLockClock} className="w-5 h-5" />}
            {state === "joined" && "Joined Mission"}
            {state === "awaiting_approval" && "Awaiting Approval"}
            {state === "not_joined" && "Join Mission"}
            {state === "loading" && "Loading..."}
        </Button>
    );
}
