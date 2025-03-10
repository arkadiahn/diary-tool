import { type MissionMilestone, MissionMilestone_State } from "@arkadiahn/apis/intra/v1/mission_milestone_pb";

import { Checkbox, DatePicker, Input } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { now, parseAbsolute } from "@internationalized/date";
import CustomEditModal from "../CustomEditModal";
import { useMilestoneStore } from "./_milestoneStore";
import { timestampToDate } from "@/api/utils";

export default function EditMissionMilestoneModal() {
    const selectedMilestone = useMilestoneStore((state) => state.selectedMilestone);
    const updateMilestone = useMilestoneStore((state) => state.updateMilestone);
    const createMilestone = useMilestoneStore((state) => state.createMilestone);
    const missionName = useMilestoneStore((state) => state.missionName);
    const toggleEdit = useMilestoneStore((state) => state.toggleEdit);
    const editOpen = useMilestoneStore((state) => state.editOpen);

    return (
        <CustomEditModal
            isOpen={editOpen}
            onOpenChange={toggleEdit}
            title="Milestones Details"
            data={selectedMilestone}
            onUpdate={async (data: MissionMilestone) => await updateMilestone(missionName ?? "", data)}
            onCreate={async (data: MissionMilestone) => await createMilestone(missionName ?? "", data)}
        >
            <input name="name" value={selectedMilestone?.name ?? ""} readOnly={true} className="hidden" />
            <Input
				size="sm"
				label="Title"
				name="title"
				placeholder="Enter mission title"
				defaultValue={selectedMilestone?.title}
				isRequired={true}
			/>
			<Textarea
                label="Description"
                name="description"
                defaultValue={selectedMilestone?.description}
                placeholder="Enter milestone description"
                isRequired={true}
            />
            <DatePicker
                size="sm"
                label="End Time"
                name="endTime"
                defaultValue={
                    selectedMilestone?.endTime ? parseAbsolute(timestampToDate(selectedMilestone.endTime)?.toISOString() ?? "", "Europe/Berlin") : null
                }
                placeholderValue={now("Europe/Berlin")}
                isRequired={true}
            />
            <Checkbox
                size="sm"
                name="completed"
                defaultSelected={selectedMilestone?.state === MissionMilestone_State.COMPLETED}
            >
                Milestone Completed
            </Checkbox>
        </CustomEditModal>
    );
}
