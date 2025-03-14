import { timestampToDate } from "@/api/utils";
import type { Account } from "@arkadiahn/apis/intra/v1/account_pb";
import type { MissionMilestone } from "@arkadiahn/apis/intra/v1/mission_milestone_pb";
import { Mission_State } from "@arkadiahn/apis/intra/v1/mission_pb";
import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";

import { Divider } from "@heroui/react";
import MissionCard from "./MissionCard";

interface MissionLayoutProps {
    missions: Mission[];
    accounts: Account[];
    milestones: MissionMilestone[];
}
export default function MissionLayout({ missions, accounts, milestones }: MissionLayoutProps) {
    // @todo needs to be fixed
    const featuredMissions = missions.filter(
        (mission) => mission.state === Mission_State.ACTIVE && timestampToDate(mission.kickoffTime)! > new Date(),
    );

    return (
        <div className="flex flex-col gap-6">
            {featuredMissions.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold pl-1">Launching Soon 🚀</h3>
                    <div className="relative rounded-large p-[2px] overflow-hidden bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-2 bg-background rounded-[calc(theme(borderRadius.large)-1px)]">
                            {featuredMissions.map((mission) => (
                                <MissionCard
                                    key={mission.name}
                                    mission={mission}
                                    accounts={accounts}
                                    milestones={milestones}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {missions.map((mission) => (
                    <MissionCard key={mission.name} mission={mission} accounts={accounts} milestones={milestones} />
                ))}
            </div>
        </div>
    );
}
