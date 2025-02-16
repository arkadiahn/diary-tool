import { getMissions } from "@/api/missionboard";
import type { MissionSummaryArray } from "@/api/missionboard";
import CustomIcon from "@/components/CustomIcon";
import { Input } from "@heroui/react";
import icRoundSearch from "@iconify/icons-ic/round-search";
import MainPageLayout from "../src/components/MainPageLayout";
import MissionView from "./MissionView";

export default async function Home() {
    const data = await getMissions({
        format: "summary",
    });

    return (
        <MainPageLayout
            title="MissionBoard"
            description="Manage all missions"
            headerItems={
                <Input
                    placeholder="Search..."
                    className="w-full self-center lg:max-w-xs"
                    isClearable={true}
                    startContent={<CustomIcon icon={icRoundSearch} className="w-6 h-6 pointer-events-none" />}
                />
            }
        >
            <main className="flex-1 flex flex-col overflow-hidden w-full h-full">
                <MissionView missions={data.data as MissionSummaryArray} />
            </main>
        </MainPageLayout>
    );
}
