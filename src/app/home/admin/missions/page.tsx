"use client";

import { type Mission, Mission_ApprovalState, Mission_State } from "@arkadiahn/apis/intra/v1/mission_pb";

import { Button, Chip } from "@heroui/react";
import { useEffect } from "react";
import { AreYouSure } from "../AreYouSurePopup";
import CustomGrid from "../CustomGrid";
import EditMissionModal from "./EditMissionModal";
import { AccountStoreProvider } from "./_accountStore";
import { MilestoneStoreProvider } from "./_milestoneStore";
import { MissionsStoreProvider, useMissionsStore } from "./_missionsStore";
import { timestampToDate } from "@/api/utils";

function StateRenderer(props: { value: Mission_State }) {
    return (
        <div className="flex items-center justify-center h-full">
            <Chip
                color={
                    {
                        [Mission_State.COMPLETED]: "success",
                        [Mission_State.ACTIVE]: "primary",
                        [Mission_State.FAILED]: "danger",
                        [Mission_State.PENDING]: "warning",
                        [Mission_State.UNSPECIFIED]: "warning",
                    }[props.value] as "success" | "primary" | "danger" | "warning" | "default" | "secondary"
                }
                size="sm"
                radius="lg"
                variant="dot"
            >
                {{
                    [Mission_State.COMPLETED]: "Completed",
                    [Mission_State.ACTIVE]: "Active",
                    [Mission_State.FAILED]: "Failed",
                    [Mission_State.PENDING]: "Pending",
                    [Mission_State.UNSPECIFIED]: "Unspecified",
                }[props.value]}
            </Chip>
        </div>
    );
}

function ApproveRenderer(props: { value: Mission_ApprovalState; data: Mission }) {
    const approveMission = useMissionsStore((state) => state.approveMission);
    const rejectMission = useMissionsStore((state) => state.rejectMission);

    if (props.value === Mission_ApprovalState.APPROVED || props.value === Mission_ApprovalState.REJECTED) {
        return (
            <div className="flex items-center justify-center h-full">
                <Chip color={props.value === Mission_ApprovalState.APPROVED ? "success" : "danger"} size="sm" radius="lg" variant="dot">
                    {props.value === Mission_ApprovalState.APPROVED ? "Approved" : "Rejected"}
                </Chip>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-full gap-2">
            <Button size="sm" color="success" onPress={() => approveMission(props.data)}>
                Approve
            </Button>
            <Button size="sm" color="danger" onPress={() => rejectMission(props.data)}>
                Reject
            </Button>
        </div>
    );
}

function AdminMissions() {
    const fetchMissions = useMissionsStore((state) => state.fetchMissions);
    const deleteMission = useMissionsStore((state) => state.deleteMission);
    const selectMission = useMissionsStore((state) => state.selectMission);
    const undeleteMission = useMissionsStore((state) => state.undeleteMission);
    const missions = useMissionsStore((state) => state.missions);
    const loading = useMissionsStore((state) => state.loading);

    useEffect(() => {
        fetchMissions();
    }, []);

    return (
        <main className="h-full w-full flex flex-col items-center justify-center p-4">
            <CustomGrid
                onEdit={selectMission}
                onCreate={selectMission}
                onDelete={deleteMission}
                onUndelete={undeleteMission}
                tableTitle="Missions"
                data={missions as Mission[]}
                loading={loading}
                columnDefs={[
                    { field: "name", sortable: true },
                    { field: "title", sortable: true, minWidth: 180, pinned: "left" },
                    {
                        field: "state",
                        headerName: "State",
                        sortable: true,
                        minWidth: 130,
                        cellRenderer: StateRenderer,
                    },
                    {
                        field: "approvalState",
                        headerName: "Approval",
                        sortable: true,
                        minWidth: 160,
                        cellRenderer: ApproveRenderer,
                        comparator: (valueA, valueB) => {
                            if (valueA === valueB) {
                                return 0;
                            }
                            if (valueA === Mission_ApprovalState.PENDING) {
                                return -1;
                            }
                            if (valueB === Mission_ApprovalState.PENDING) {
                                return 1;
                            }
                            if (valueA === Mission_ApprovalState.APPROVED) {
                                return -1;
                            }
                            if (valueB === Mission_ApprovalState.APPROVED) {
                                return 1;
                            }
                            return 0;
                        },
                    },
                    { field: "description", sortable: true },
                    { field: "descriptionGoal", sortable: true },
                    { field: "descriptionSkills", headerName: "Skills Description", sortable: true },
                    { field: "githubLink", sortable: true },
                    { field: "leader", sortable: true, minWidth: 130 },
                    {
                        field: "likeCount",
                        headerName: "Likes",
                        sortable: true,
                        type: "numericColumn",
                    },
                    {
                        field: "createTime",
                        headerName: "Created",
                        sortable: true,
                        minWidth: 180,
                        valueFormatter: (params) => timestampToDate(params.value)?.toLocaleString() ?? "",
                        comparator: (valueA, valueB) => {
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                        sort: "desc",
                        sortIndex: 0,
                    },
                    {
                        field: "updateTime",
                        headerName: "Updated",
                        sortable: true,
                        valueFormatter: (params) => timestampToDate(params.value)?.toLocaleString() ?? "",
                        comparator: (valueA, valueB) => {
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                    },
                    {
                        field: "kickoffTime",
                        headerName: "Kickoff",
                        sortable: true,
                        valueFormatter: (params) => (params.value ? timestampToDate(params.value)?.toLocaleString() ?? "" : ""),
                        comparator: (valueA, valueB) => {
                            if (!valueA) {
                                return 1;
                            }
                            if (!valueB) {
                                return -1;
                            }
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                    },
                    {
                        field: "endTime",
                        headerName: "End Time",
                        sortable: true,
                        valueFormatter: (params) => (params.value ? timestampToDate(params.value)?.toLocaleString() ?? "" : ""),
                        comparator: (valueA, valueB) => {
                            if (!valueA) {
                                return 1;
                            }
                            if (!valueB) {
                                return -1;
                            }
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                    },
                    {
                        field: "deleteTime",
                        headerName: "Deleted",
                        sortable: true,
                        minWidth: 180,
                        sort: "desc",
                        sortIndex: 1,
                        valueFormatter: (params) => (params.value ? timestampToDate(params.value)?.toLocaleString() ?? "" : ""),
                        comparator: (valueA, valueB) => {
                            if (!valueA) {
                                return 1;
                            }
                            if (!valueB) {
                                return -1;
                            }
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                    },
                ]}
            />
            <AccountStoreProvider>
                <MilestoneStoreProvider>
                    <EditMissionModal />
                </MilestoneStoreProvider>
            </AccountStoreProvider>
        </main>
    );
}

export default function AdminMissionsWrapper() {
    return (
        <MissionsStoreProvider>
            <AreYouSure />
            <AdminMissions />
        </MissionsStoreProvider>
    );
}
