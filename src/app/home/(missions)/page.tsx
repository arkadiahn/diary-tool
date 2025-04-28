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

import { auth } from "@/auth/server";
/* ---------------------------------- Icons --------------------------------- */
import icRoundFilterList from "@iconify/icons-ic/round-filter-list";
import icRoundSearch from "@iconify/icons-ic/round-search";

// async function getMilestones() {
//     const { milestones } = await webClient.listMilestones({});
//     return milestones;
// }

// async function getAccounts() {
//     const { accounts } = await webClient.listAccounts({});
//     return accounts;
// }

export default async function Home() {
    const { missions } = await webClient.listMissions({});
	// const allAccounts = await Promise.all(getAccounts());
    const { accounts } = { accounts: [] };
    const { milestones } = { milestones: [] };
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
					placeholder="Search..."
					className="w-full self-center lg:max-w-lg"
					isClearable={true}
					startContent={<CustomIcon icon={icRoundSearch} className="w-6 h-6 pointer-events-none" />}
				/>
			</div>
			<ScrollShadow className="w-full flex-1 scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent px-4 py-5 -ml-2">
				<MissionLayout missions={missions} accounts={accounts} milestones={milestones} />
			</ScrollShadow>
		</div>
    );
}
