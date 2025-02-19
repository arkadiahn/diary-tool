import {
    type Mission,
    type MissionArray,
    approveMission,
    deleteMission,
    getMissions,
    patchMission,
    postMission,
    rejectMission,
} from "@/api/missionboard";
import toast from "react-hot-toast";
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
				if (response.status >= 300 || response.status < 200) {
					throw new Error("Failed to fetch missions");
				}
				set({ missions: response.data as MissionArray, loading: false });
			} catch (error) {
				toast.error("Failed to fetch missions");
				set({ loading: false });
			}
        },
        selectMission: (mission: Mission | null) => {
            set({ selectedMission: mission, editOpen: true });
        },
        createMission: async (mission: Mission) => {
            try {
                const response = await postMission(mission);
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to create mission");
                }
                toast.success("Mission created successfully");
                get().fetchMissions();
				set({ editOpen: false });
            } catch (error) {
                toast.error("Failed to create mission");
            }
        },
        updateMission: async (mission: Mission) => {
            try {
                const response = await patchMission(mission.name.split("/").at(-1) ?? "", mission);
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to update mission");
                }
                toast.success("Mission updated successfully");
                get().fetchMissions();
				set({ editOpen: false });
            } catch (error) {
                toast.error("Failed to update mission");
            }
        },
        deleteMission: async (mission: Mission) => {
            try {
                const response = await deleteMission(mission.name.split("/").at(-1) ?? "", {
                    allow_missing: true,
                });
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to delete mission");
                }
                toast.success("Mission deleted successfully");
                get().fetchMissions();
            } catch (error) {
                toast.error("Failed to delete mission");
            }
        },
        approveMission: async (mission: Mission) => {
            try {
                const response = await approveMission(mission.name.split("/").at(-1) ?? "");
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to approve mission");
                }
                toast.success("Mission approved successfully");
                get().fetchMissions();
            } catch (error) {
                toast.error("Failed to approve mission");
            }
        },
        rejectMission: async (mission: Mission) => {
            try {
                const response = await rejectMission(mission.name.split("/").at(-1) ?? "");
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to reject mission");
                }
                toast.success("Mission rejected successfully");
                get().fetchMissions();
            } catch (error) {
                toast.error("Failed to reject mission");
            }
        },
    }),
);
