import { type MissionMilestone, MissionMilestoneState } from "@/api/missionboard";
import { Checkbox, DatePicker } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { now, parseAbsolute } from "@internationalized/date";
import CustomEditModal from "../CustomEditModal";
import { useMilestoneStore } from "./_milestoneStore";

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
                name="end_time"
                defaultValue={
                    selectedMilestone?.end_time ? parseAbsolute(selectedMilestone.end_time, "Europe/Berlin") : null
                }
                placeholderValue={now("Europe/Berlin")}
                isRequired={true}
            />
            <Checkbox
                size="sm"
                name="completed"
                defaultSelected={selectedMilestone?.state === MissionMilestoneState.completed}
            >
                Milestone Completed
            </Checkbox>
        </CustomEditModal>
    );
}
