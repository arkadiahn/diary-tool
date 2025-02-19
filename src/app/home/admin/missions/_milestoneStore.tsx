import {
    type MissionMilestone,
    deleteMissionMilestone,
    getMissionMilestones,
    patchMissionMilestone,
    postMissionMilestone,
} from "@/api/missionboard";
import createCustomStore from "../CreateCustomStore";
import { toast } from "react-hot-toast";


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
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to fetch milestones");
                }
                set({ milestones: response.data, missionName, loading: false });
            } catch (error) {
                toast.error("Failed to fetch milestones");
                set({ loading: false });
            }
        },
        selectMilestone: (milestone: MissionMilestone | null) => {
            set({ selectedMilestone: milestone, editOpen: true });
        },
        createMilestone: async (missionName: string, milestone: MissionMilestone) => {
            try {
                const response = await postMissionMilestone(missionName, milestone);
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to create milestone");
                }
                toast.success("Milestone created successfully");
                get().fetchMilestones(missionName);
                set({ editOpen: false });
            } catch (error) {
                toast.error("Failed to create milestone");
            }
        },
        updateMilestone: async (missionName: string, milestone: MissionMilestone) => {
            try {
                const response = await patchMissionMilestone(missionName, milestone.name.split("/").at(-1) ?? "", milestone);
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to update milestone");
                }
                toast.success("Milestone updated successfully");
                get().fetchMilestones(missionName);
                set({ editOpen: false });
            } catch (error) {
                toast.error("Failed to update milestone");
            }
        },
        deleteMilestone: async (missionName: string, milestone: MissionMilestone) => {
            try {
                const response = await deleteMissionMilestone(missionName, milestone.name.split("/").at(-1) ?? "");
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to delete milestone");
                }
                toast.success("Milestone deleted successfully");
                get().fetchMilestones(missionName);
            } catch (error) {
                toast.error("Failed to delete milestone");
            }
        },
    }),
);
