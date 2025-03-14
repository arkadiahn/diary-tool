import webClient from "@/api";
import type { MissionMilestone } from "@arkadiahn/apis/intra/v1/mission_milestone_pb";

import { createFieldMask } from "@/api/utils";
import { toast } from "react-hot-toast";
import { confirm } from "../AreYouSurePopup";
import createCustomStore from "../CreateCustomStore";

type MilestoneStore = {
    milestones: MissionMilestone[];
    missionName: string | null;
    selectedMilestone: MissionMilestone | null;
    loading: boolean;
    editOpen: boolean;
    toggleEdit: () => void;
    fetchMilestones: (missionName: string) => Promise<void>;
    selectMilestone: (milestone: MissionMilestone | null) => void;
    createMilestone: (missionName: string, milestone: MissionMilestone) => Promise<void>;
    updateMilestone: (missionName: string, milestone: MissionMilestone) => Promise<void>;
    deleteMilestone: (missionName: string, milestone: MissionMilestone) => Promise<void>;
};

export const { StoreProvider: MilestoneStoreProvider, useStore: useMilestoneStore } = createCustomStore<MilestoneStore>(
    (set, get) => ({
        milestones: [],
        missionName: null,
        selectedMilestone: null,
        loading: true,
        editOpen: false,
        toggleEdit: () => set({ editOpen: !get().editOpen }),
        fetchMilestones: async (missionName: string) => {
            set({ loading: true, milestones: [] });
            try {
                const { missionMilestones } = await webClient.listMissionMilestones({
                    parent: missionName,
                });
                set({ milestones: missionMilestones, missionName, loading: false });
            } catch {
                toast.error("Failed to fetch milestones");
                set({ loading: false });
            }
        },
        selectMilestone: (milestone: MissionMilestone | null) => {
            set({ selectedMilestone: milestone, editOpen: true });
        },
        createMilestone: async (missionName: string, milestone: MissionMilestone) => {
            try {
                await webClient.createMissionMilestone({
                    parent: missionName,
                    missionMilestone: milestone,
                });
                toast.success("Milestone created successfully");
                get().fetchMilestones(missionName);
                set({ editOpen: false });
            } catch {
                toast.error("Failed to create milestone");
            }
        },
        updateMilestone: async (missionName: string, milestone: MissionMilestone) => {
            try {
                await webClient.updateMissionMilestone({
                    missionMilestone: milestone,
                    updateMask: createFieldMask(milestone),
                });
                toast.success("Milestone updated successfully");
                get().fetchMilestones(missionName);
                set({ editOpen: false });
            } catch {
                toast.error("Failed to update milestone");
            }
        },
        deleteMilestone: async (missionName: string, milestone: MissionMilestone) => {
            const result = await confirm("Are you sure you want to delete this milestone?", "Delete Milestone");
            if (!result) {
                return;
            }
            try {
                await webClient.deleteMissionMilestone({
                    name: milestone.name,
                });
                toast.success("Milestone deleted successfully");
                get().fetchMilestones(missionName);
            } catch {
                toast.error("Failed to delete milestone");
            }
        },
    }),
);
