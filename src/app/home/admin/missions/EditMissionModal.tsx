import { type MissionMilestone, MissionMilestone_State } from "@arkadiahn/apis/intra/v1/mission_milestone_pb";
import type { MissionAccount } from "@arkadiahn/apis/intra/v1/mission_account_pb";
import { timestampToDate } from "@/api/utils";

import CustomIcon from "@/components/CustomIcon";
import { Button, Chip, type ChipProps, DatePicker, Input, TableCell, TableRow, Textarea, Tooltip } from "@heroui/react";
import { now, parseAbsolute } from "@internationalized/date";
import { useEffect } from "react";
import CustomEditModal from "../CustomEditModal";
import CustomInsideTable from "../CustomInsideTable";
import AccountsComponent from "./AccountsComponent";
import DateComponent from "./DateComponent";
import { useAccountStore } from "./_accountStore";
import { useMilestoneStore } from "./_milestoneStore";
import { useMissionsStore } from "./_missionsStore";

/* ---------------------------------- Icons --------------------------------- */
import EditIcon from "@iconify/icons-ic/edit";
import TrashIcon from "@iconify/icons-ic/sharp-delete";
import EditMissionAccountModal from "./EditMissionAccountModal";
import EditMissionMilestoneModal from "./EditMissionMilestoneModal";

function MilestoneState({ milestoneState }: { milestoneState: MissionMilestone_State }) {
    const props: ChipProps = {
        size: "sm",
        radius: "lg",
        variant: "dot",
    };

	switch (milestoneState) {
		case MissionMilestone_State.COMPLETED:
			return (
				<Chip color="success" {...props}>
					Completed
				</Chip>
			);
		case MissionMilestone_State.FAILED:
			return (
				<Chip color="danger" {...props}>
					Failed
				</Chip>
			);
		default:
			return (
				<Chip color="primary" {...props}>
					Planned
				</Chip>
			);
	}
}

export default function EditMissionModal() {
    const updateMission = useMissionsStore((state) => state.updateMission);
    const createMission = useMissionsStore((state) => state.createMission);
    const mission = useMissionsStore((state) => state.selectedMission);
    const toggleEdit = useMissionsStore((state) => state.toggleEdit);
    const editOpen = useMissionsStore((state) => state.editOpen);

    const selectMilestone = useMilestoneStore((state) => state.selectMilestone);
    const fetchMilestones = useMilestoneStore((state) => state.fetchMilestones);
    const deleteMilestone = useMilestoneStore((state) => state.deleteMilestone);
    const milestonesLoading = useMilestoneStore((state) => state.loading);
    const milestones = useMilestoneStore((state) => state.milestones);

    const approveAccount = useAccountStore((state) => state.approveAccount);
    const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
    const removeAccount = useAccountStore((state) => state.removeAccount);
    const rejectAccount = useAccountStore((state) => state.rejectAccount);
    const toggleAddAccount = useAccountStore((state) => state.toggleAdd);
    const accountsLoading = useAccountStore((state) => state.loading);
    const accounts = useAccountStore((state) => state.accounts);

    useEffect(() => {
        if (mission) {
            fetchMilestones(mission.name);
            fetchAccounts(mission.name);
        }
    }, [mission]);

    return (
        <>
            <CustomEditModal
                isOpen={editOpen}
                onOpenChange={toggleEdit}
                title="Mission Details"
                data={mission}
                onUpdate={updateMission}
                onCreate={createMission}
            >
                <input name="name" value={mission?.name} readOnly={true} className="hidden" />
                <Input
                    size="sm"
                    label="Title"
                    name="title"
                    placeholder="Enter mission title"
                    defaultValue={mission?.title}
                    isRequired={true}
                />
                {mission && <AccountsComponent defaultAccount={mission.leader} title="Leader" name="leader" />}
                <DatePicker
					size="sm"
					label="Kickoff Time"
					name="kickoffTime"
					defaultValue={
						mission?.kickoffTime ? parseAbsolute(
							timestampToDate(mission.kickoffTime)?.toISOString() ?? "", 
							"Europe/Berlin"
						) : null
					}
					placeholderValue={now("Europe/Berlin")}
					isRequired={true}
				/>
				<AccountsComponent
					title="Mission Leader"
					name="leader"
					defaultAccount={mission?.leader}
				/>
                <Input
                    size="sm"
                    label="GitHub Link"
                    name="githubLink"
                    placeholder="Enter GitHub repository URL"
                    type="url"
                    defaultValue={mission?.githubLink}
                />
                <Textarea
                    label="Description"
                    name="description"
                    placeholder="Enter mission description"
                    defaultValue={mission?.description ?? ""}
                    minRows={8}
                    size="sm"
                    isRequired={true}
                />
                <Textarea
                    label="Goals"
                    name="descriptionGoal"
                    defaultValue={mission?.descriptionGoal ?? ""}
                    placeholder="Enter mission goals"
                    minRows={6}
                    size="sm"
                />
                <Textarea
                    label="Required Skills"
                    name="descriptionSkills"
                    defaultValue={mission?.descriptionSkills ?? ""}
                    placeholder="Enter required skills"
                    minRows={6}
                    size="sm"
                />

                {mission && (
                    <>
                        <CustomInsideTable
                            loading={milestonesLoading}
                            emptyContent="No milestones found"
                            title="Milestones"
                            onAdd={() => selectMilestone(null)}
                            header={["Title", "State", "End Time", "Actions"]}
                        >
                            {milestones.map((milestone: MissionMilestone) => (
                                <TableRow key={milestone.name}>
                                    <TableCell>{milestone.title}</TableCell>
                                    <TableCell>{<MilestoneState milestoneState={milestone.state} />}</TableCell>
                                    <TableCell width={200}>
                                        <DateComponent date={timestampToDate(milestone.endTime)?.toISOString() ?? ""} />
                                    </TableCell>
                                    <TableCell className="flex flex-row gap-2 items-center justify-center">
                                        <Tooltip color="danger" content="Delete">
                                            <span
                                                className="text-sm text-danger cursor-pointer active:opacity-50"
                                                onClick={() => {
                                                    deleteMilestone(mission.name, milestone);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        deleteMilestone(mission.name, milestone);
                                                    }
                                                }}
                                            >
                                                <CustomIcon icon={TrashIcon} height={20} width={20} />
                                            </span>
                                        </Tooltip>
                                        <Tooltip content="Edit">
                                            <span
                                                className="text-sm text-default-400 cursor-pointer active:opacity-50"
                                                onClick={() => selectMilestone(milestone)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        selectMilestone(milestone);
                                                    }
                                                }}
                                            >
                                                <CustomIcon icon={EditIcon} height={20} width={20} />
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </CustomInsideTable>

                        <CustomInsideTable
                            loading={accountsLoading}
                            emptyContent="No accounts found"
                            title="Accounts"
                            onAdd={toggleAddAccount}
                            header={["Nickname", "Approved", "Actions"]}
                        >
                            {accounts.map((account: MissionAccount) => (
                                <TableRow key={account.name}>
                                    <TableCell>{account.name}</TableCell>
                                    <TableCell width={200}>
                                        <div className="flex flex-row gap-2 items-center">
                                            {account.approved ? (
                                                <Chip color="success" size="sm" radius="lg" variant="dot">
                                                    Approved
                                                </Chip>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        color="success"
                                                        onPress={() => {
                                                            approveAccount(mission.name, account);
                                                        }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        onPress={() => {
                                                            rejectAccount(mission.name, account);
                                                        }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell width={50}>
                                        <div className="flex items-center justify-center">
                                            <Tooltip color="danger" content="Delete">
                                                <span
                                                    className="text-sm text-danger cursor-pointer active:opacity-50"
                                                    onClick={() => {
                                                        removeAccount(mission.name, account);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            removeAccount(mission.name, account);
                                                        }
                                                    }}
                                                >
                                                    <CustomIcon icon={TrashIcon} height={20} width={20} />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </CustomInsideTable>
                    </>
                )}
            </CustomEditModal>

            {/* -------------------------- Edit Milestone Modal -------------------------- */}
            <EditMissionMilestoneModal />

            {/* --------------------------- Edit Account Modal --------------------------- */}
            <EditMissionAccountModal />
        </>
    );
}
