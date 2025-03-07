import webClient from "@/api";

import CustomIcon from "@/components/CustomIcon";
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollShadow,
} from "@heroui/react";
import MainPageLayout from "../src/components/MainPageLayout";
import CalendarLayout from "./CalendarLayout";
/* ---------------------------------- Icons --------------------------------- */
import icRoundFilterList from "@iconify/icons-ic/round-filter-list";
import icRoundSearch from "@iconify/icons-ic/round-search";


/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */
export default async function CalendarPage() {
	const { events } = await webClient.listEvents({});

    return (
        <MainPageLayout
            title="Calendar"
            description="Find your next event"
            headerItems={
                <>
                    <Popover placement="bottom-end">
                        <PopoverTrigger>
                            <Button>
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
                </>
            }
        >
            <ScrollShadow className="w-full flex-1 scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent px-2 pb-5 -ml-2">
                <CalendarLayout events={events} />
            </ScrollShadow>
        </MainPageLayout>
    );
}
