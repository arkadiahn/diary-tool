import { type MissionSummaryArray, getMissions } from "@/api/missionboard";
import MissionView from "./view";

export default async function MissionViewWrapper() {
    const data = await getMissions({
        format: "summary",
    });

    return <MissionView missions={data.data as MissionSummaryArray} />;
}
