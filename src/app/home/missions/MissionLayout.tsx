import type { MissionSummaryArray } from "@/api/missionboard";
import MissionCard from "./MissionCard";

export default function MissionLayout({ missions }: { missions: MissionSummaryArray }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {missions.map((mission) => (
                <MissionCard key={mission.name} mission={mission} />
            ))}
        </div>
    );
}
