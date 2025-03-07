import type { MissionMilestone } from "@arkadiahn/apis/intra/v1/mission_milestone_pb";
import type { Account } from "@arkadiahn/apis/intra/v1/account_pb";
import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";
import MissionCard from "./MissionCard";

interface MissionLayoutProps {
	missions: Mission[];
	accounts: Account[];
	milestones: MissionMilestone[];
}
export default function MissionLayout({ missions, accounts, milestones }: MissionLayoutProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {missions.map((mission) => (
                <MissionCard key={mission.name} mission={mission} accounts={accounts} milestones={milestones} />
            ))}
        </div>
    );
}
