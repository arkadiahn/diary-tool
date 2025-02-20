import type { MissionSummaryArray } from "@/api/missionboard";
import MissionCard from "./MissionCard";

export default function MissionLayout({ missions }: { missions: MissionSummaryArray }) {
    return (
        <>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
				{missions.map((mission) => (
					<MissionCard key={mission.name} mission={mission} />
				))}
			</div>

			{/* <div className="grid gap-6 grid-cols-[repeat(auto-fill,300px)] justify-center p-6">
				{missions.map((mission) => (
					<MissionCard key={mission.name} data={mission} />
				))}
			</div> */}
        </>
    );
}
