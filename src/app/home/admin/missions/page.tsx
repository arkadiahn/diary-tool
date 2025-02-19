"use client";

import { Button, Chip } from "@heroui/react";
import { useEffect } from "react";
import CustomGrid from "../CustomGrid";
import EditMissionModal from "./EditMissionModal";
import { AccountStoreProvider } from "./_accountStore";
import { MilestoneStoreProvider } from "./_milestoneStore";
import { MissionsStoreProvider, useMissionsStore } from "./_missionsStore";


function StateRenderer(props: any) {
    return (
        <div className="flex items-center justify-center h-full">
            <Chip
                color={props.value === "completed" ? "success" : props.value === "active" ? "warning" : "danger"}
                size="sm"
                radius="lg"
                variant="dot"
            >
                {props.value}
            </Chip>
        </div>
    );
}

function ApproveRenderer(props: any) {
    const approveMission = useMissionsStore((state) => state.approveMission);
    const rejectMission = useMissionsStore((state) => state.rejectMission);

    if (props.value === "approved" || props.value === "rejected") {
        return (
            <div className="flex items-center justify-center h-full">
                <Chip color={props.value === "approved" ? "success" : "danger"} size="sm" radius="lg" variant="dot">
                    {props.value === "approved" ? "Approved" : "Rejected"}
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
    const missions = useMissionsStore((state) => state.missions);
    const loading = useMissionsStore((state) => state.loading);

    useEffect(() => {
        fetchMissions();
    }, []);

    return (
        <main className="h-full w-full flex flex-col items-center justify-center p-4">
            <CustomGrid
                onEdit={(mission) => selectMission(mission)}
                onCreate={() => selectMission(null)}
                onDelete={(mission) => deleteMission(mission)}
                tableTitle="Missions"
                data={missions}
                loading={loading}
                columnDefs={[
                    { field: "name", sortable: true },
                    { field: "title", sortable: true, minWidth: 180 },
                    {
                        field: "mission_state",
                        headerName: "State",
                        sortable: true,
                        minWidth: 130,
                        cellRenderer: StateRenderer,
                    },
                    {
                        field: "approval_state",
                        headerName: "Approval",
                        sortable: true,
                        minWidth: 160,
                        cellRenderer: ApproveRenderer,
                        comparator: (valueA, valueB) => {
                            if (valueA === valueB) return 0;
                            if (valueA === "pending") return -1;
                            if (valueB === "pending") return 1;
                            if (valueA === "approved") return -1;
                            if (valueB === "approved") return 1;
                            return 0;
                        },
                    },
                    { field: "description", sortable: true },
                    { field: "description_goal", sortable: true },
                    { field: "description_skills", headerName: "Skills Description", sortable: true },
                    { field: "github_link", sortable: true },
                    { field: "leader", sortable: true, minWidth: 130 },
                    {
                        field: "like_count",
                        headerName: "Likes",
                        sortable: true,
                        type: "numericColumn",
                    },
                    {
                        field: "create_time",
                        headerName: "Created",
                        sortable: true,
                        minWidth: 180,
                        valueFormatter: (params) => new Date(params.value).toLocaleString(),
                        comparator: (valueA, valueB) => {
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                        sort: "desc",
                        sortIndex: 0,
                    },
                    {
                        field: "update_time",
                        headerName: "Updated",
                        sortable: true,
                        valueFormatter: (params) => new Date(params.value).toLocaleString(),
                        comparator: (valueA, valueB) => {
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                    },
                    {
                        field: "kickoff_time",
                        headerName: "Kickoff",
                        sortable: true,
                        valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : ""),
                        comparator: (valueA, valueB) => {
                            if (!valueA) return 1;
                            if (!valueB) return -1;
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                    },
                    {
                        field: "end_time",
                        headerName: "End Time",
                        sortable: true,
                        valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : ""),
                        comparator: (valueA, valueB) => {
                            if (!valueA) return 1;
                            if (!valueB) return -1;
                            const dateA = new Date(valueA).getTime();
                            const dateB = new Date(valueB).getTime();
                            return dateA - dateB;
                        },
                    },
                    {
                        field: "delete_time",
                        headerName: "Deleted",
                        sortable: true,
                        minWidth: 180,
                        sort: "desc",
                        sortIndex: 1,
                        valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : ""),
                        comparator: (valueA, valueB) => {
                            if (!valueA) return 1;
                            if (!valueB) return -1;
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
            <AdminMissions />
        </MissionsStoreProvider>
    );
}
