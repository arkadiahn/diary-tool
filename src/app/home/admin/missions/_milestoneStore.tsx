import {
    type MissionMilestone,
    deleteMissionMilestone,
    getMissionMilestones,
    patchMissionMilestone,
    postMissionMilestone,
} from "@/api/missionboard";
import { toast } from "react-hot-toast";
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
                const response = await getMissionMilestones(missionName);
                set({ milestones: response.data, missionName, loading: false });
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
                await postMissionMilestone(missionName, milestone);
                toast.success("Milestone created successfully");
                get().fetchMilestones(missionName);
                set({ editOpen: false });
            } catch {
                toast.error("Failed to create milestone");
            }
        },
        updateMilestone: async (missionName: string, milestone: MissionMilestone) => {
            try {
                await patchMissionMilestone(missionName, milestone.name, milestone);
                toast.success("Milestone updated successfully");
                get().fetchMilestones(missionName);
                set({ editOpen: false });
            } catch {
                toast.error("Failed to update milestone");
            }
        },
        deleteMilestone: async (missionName: string, milestone: MissionMilestone) => {
            try {
                await deleteMissionMilestone(missionName, milestone.name);
                toast.success("Milestone deleted successfully");
                get().fetchMilestones(missionName);
            } catch {
                toast.error("Failed to delete milestone");
            }
        },
    }),
);
