import webClient from "@/api";

import CustomIcon from "@/components/CustomIcon";
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Input,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollShadow,
    Tooltip,
} from "@heroui/react";
import MainPageLayout from "../src/components/MainPageLayout";
import MissionLayout from "./MissionLayout";
import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";
import type { MissionMilestone } from "@arkadiahn/apis/intra/v1/mission_milestone_pb";
import type { MissionAccount } from "@arkadiahn/apis/intra/v1/mission_account_pb";
import { auth } from "@/auth/server";

/* ---------------------------------- Icons --------------------------------- */
import icRoundFilterList from "@iconify/icons-ic/round-filter-list";
import icRoundSearch from "@iconify/icons-ic/round-search";

async function getMissionMilestones(missions: Mission[]) {
	const allMilestones: MissionMilestone[][] = [];
	for (const mission of missions) {
		const { missionMilestones } = await webClient.listMissionMilestones({
			parent: mission.name,
		});
		allMilestones.push(missionMilestones);
	}
	return allMilestones;
}

async function getMissionAccounts(missions: Mission[]) {
	const allAccounts: MissionAccount[][] = [];
	for (const mission of missions) {
		const { missionAccounts } = await webClient.listMissionAccounts({
			parent: mission.name,
		});
		allAccounts.push(missionAccounts);
	}
	return allAccounts;
}

export default async function Home() {
    const { missions } = await webClient.listMissions({});
	const [missionMilestones, missionAccounts] = await Promise.all(
		[getMissionMilestones(missions), getMissionAccounts(missions)]
	);
    const { session } = await auth({});

    return (
		<div className="w-full h-full flex flex-col items-center">
			<div className="flex justify-end items-center gap-2 w-full">
				<Button
					as={Link}
					color="primary"
					href="/create"
					variant="flat"
					className="min-w-[120px]"
					isDisabled={!session}
				>
					Create Mission
				</Button>
				<Popover placement="bottom-end">
					<PopoverTrigger>
						<Button isDisabled={true}>
							Filters
							<div>
								<CustomIcon icon={icRoundFilterList} width={16} height={16} />
							</div>
						</Button>
					</PopoverTrigger>
					<PopoverContent title="Filters" className="px-5 py-4 items-start rounded-large">
						<CheckboxGroup
							aria-label="Event Type"
							description="Choose the type of events you want to see"
							label="Event Type"
						>
							<Checkbox value="1">Event</Checkbox>
							<Checkbox value="2">Topic</Checkbox>
						</CheckboxGroup>
					</PopoverContent>
				</Popover>
				<Input
					isDisabled={true}
					placeholder="Search..."
					className="w-full self-center lg:max-w-lg"
					isClearable={true}
					startContent={<CustomIcon icon={icRoundSearch} className="w-6 h-6 pointer-events-none" />}
				/>
			</div>
			<ScrollShadow className="w-full flex-1 scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent px-4 py-5 -ml-2">
				<MissionLayout missions={missions} accounts={missionAccounts} milestones={missionMilestones} />
			</ScrollShadow>
		</div>
    );
}
