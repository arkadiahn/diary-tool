import {
    type Mission,
    type MissionArray,
    approveMission,
    deleteMission,
    getMissions,
    patchMission,
    postMission,
    rejectMission,
	undeleteMission,
} from "@/api/missionboard";
import toast from "react-hot-toast";
import { confirm } from "../AreYouSurePopup";
import createCustomStore from "../CreateCustomStore";
type MissionsStore = {
    selectedMission: Mission | null;
    missions: MissionArray;
    loading: boolean;
    editOpen: boolean;
    toggleEdit: () => void;
    fetchMissions: () => Promise<void>;
    selectMission: (mission: Mission | null) => void;
    createMission: (mission: Mission) => Promise<void>;
    updateMission: (mission: Mission) => Promise<void>;
    deleteMission: (mission: Mission) => Promise<void>;
	undeleteMission: (mission: Mission) => Promise<void>;
    approveMission: (mission: Mission) => Promise<void>;
    rejectMission: (mission: Mission) => Promise<void>;
};

export const { StoreProvider: MissionsStoreProvider, useStore: useMissionsStore } = createCustomStore<MissionsStore>(
    (set, get) => ({
        missions: [],
        loading: true,
        selectedMission: null,
        editOpen: false,
        toggleEdit: () => set((state) => ({ editOpen: !state.editOpen })),
        fetchMissions: async () => {
            set({ loading: true, missions: [] });
            try {
                const response = await getMissions({
                    show_unapproved: true,
                    show_deleted: true,
                });
                set({ missions: response.data as MissionArray, loading: false });
            } catch {
                toast.error("Failed to fetch missions");
                set({ loading: false });
            }
        },
        selectMission: (mission: Mission | null) => {
            set({ selectedMission: mission, editOpen: true });
        },
        createMission: async (mission: Mission) => {
            try {
                await postMission(mission);
                toast.success("Mission created successfully");
                get().fetchMissions();
                set({ editOpen: false });
            } catch {
                toast.error("Failed to create mission");
            }
        },
        updateMission: async (mission: Mission) => {
            try {
                await patchMission(mission.name, mission);
                toast.success("Mission updated successfully");
                get().fetchMissions();
                set({ editOpen: false });
            } catch {
                toast.error("Failed to update mission");
            }
        },
        deleteMission: async (mission: Mission) => {
            const result = await confirm("Are you sure you want to delete this mission?", "Delete Mission");
            if (!result) return;
            try {
                await deleteMission(mission.name, {
                    allow_missing: true,
                });
                toast.success("Mission deleted successfully");
                get().fetchMissions();
            } catch {
                toast.error("Failed to delete mission");
            }
        },
		undeleteMission: async (mission: Mission) => {
			try {
				await undeleteMission(mission.name);
				toast.success("Mission undeleted successfully");
				get().fetchMissions();
			} catch {
				toast.error("Failed to undelete mission");
			}
		},
        approveMission: async (mission: Mission) => {
            try {
                await approveMission(mission.name);
                toast.success("Mission approved successfully");
                get().fetchMissions();
            } catch {
                toast.error("Failed to approve mission");
            }
        },
        rejectMission: async (mission: Mission) => {
            const result = await confirm("Are you sure you want to reject this mission?", "Reject Mission");
            if (!result) return;
            try {
                await rejectMission(mission.name);
                toast.success("Mission rejected successfully");
                get().fetchMissions();
            } catch {
                toast.error("Failed to reject mission");
            }
        },
    }),
);
