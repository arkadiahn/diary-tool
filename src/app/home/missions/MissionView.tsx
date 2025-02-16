import type { MissionSummaryArray } from "@/api/missionboard";
import { ScrollShadow } from "@heroui/react";
import MissionCard from "./MissionCard";

export default function MissionView({ missions }: { missions: MissionSummaryArray }) {
    return (
        <>
            {/* @todo: Fix scrollbar overlayed by shadow */}
            <ScrollShadow className="scrollbar scrollbar-thumb-default-300 scrollbar-track-transparent">
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,300px)] justify-center p-6">
                    {missions.map((mission) => (
                        <MissionCard key={mission.name} data={mission} />
                    ))}
                </div>
            </ScrollShadow>
        </>
    );
}
