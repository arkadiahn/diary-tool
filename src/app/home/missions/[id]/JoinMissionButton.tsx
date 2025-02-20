import { type Mission, getMissionAccount, postMissionAccount } from "@/api/missionboard";
import { useSession } from "@/auth/client";
import CustomIcon from "@/components/CustomIcon";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

/* ---------------------------------- Icons --------------------------------- */
import icLockClock from "@iconify/icons-ic/baseline-lock-clock";
import icCheckFill from "@iconify/icons-ri/check-fill";

interface JoinMissionButtonProps {
    mission: Mission;
}
export default function JoinMissionButton({ mission }: JoinMissionButtonProps) {
    const [state, setState] = useState<"loading" | "joined" | "not_joined" | "awaiting_approval">("loading");
    const { session } = useSession();

    useEffect(() => {
        async function fetchMissionStatus() {
            if (!session || mission.mission_state === "completed") {
                return;
            }

            try {
                const { data } = await getMissionAccount(mission.name, session.user.id, { show_unapproved: true });
                const missionAccount = data[0];

                setState(!missionAccount ? "not_joined" : missionAccount.approved ? "joined" : "awaiting_approval");
            } catch {
                toast.error("Failed to fetch mission status");
                setState("not_joined");
            }
        }
        fetchMissionStatus();
    }, [session, mission.name, mission.mission_state]);

    const handleJoinMission = async () => {
        if (session) {
            setState("awaiting_approval");
            try {
                await postMissionAccount(mission.name, { account: `accounts/${session.user.id}` });
            } catch {
                toast.error("Failed to join mission");
                setState("not_joined");
            }
        }
    };

    if (!session || mission.mission_state === "completed") {
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
