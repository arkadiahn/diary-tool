import {
    type MissionAccount,
    type MissionAccountPost,
    approveMissionAccount,
    deleteMissionAccount,
    getMissionAccounts,
    postMissionAccount,
    rejectMissionAccount,
} from "@/api/missionboard";
import createCustomStore from "../CreateCustomStore";
import { toast } from "react-hot-toast";


type AccountStore = {
    accounts: MissionAccount[];
    missionName: string | null;
    loading: boolean;
    addOpen: boolean;
    toggleAdd: () => void;
    fetchAccounts: (missionName: string) => Promise<void>;
    removeAccount: (missionName: string, account: MissionAccount) => Promise<void>;
    addAccount: (missionName: string, account: MissionAccountPost) => Promise<void>;
    approveAccount: (missionName: string, account: MissionAccount) => Promise<void>;
    rejectAccount: (missionName: string, account: MissionAccount) => Promise<void>;
};

export const { StoreProvider: AccountStoreProvider, useStore: useAccountStore } = createCustomStore<AccountStore>(
    (set, get) => ({
        accounts: [],
        missionName: null,
        loading: true,
        addOpen: false,
        toggleAdd: () => set({ addOpen: !get().addOpen }),
        fetchAccounts: async (missionName: string) => {
            set({ loading: true, accounts: [] });
            try {
                const response = await getMissionAccounts(missionName, {
                    show_unapproved: true,
                });
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to fetch accounts");
                }
                set({ accounts: response.data, missionName, loading: false });
            } catch (error) {
                toast.error("Failed to fetch accounts");
                set({ loading: false });
            }
        },
        removeAccount: async (missionName: string, account: MissionAccount) => {
            try {
                const response = await deleteMissionAccount(missionName, account.name.split("/").at(-1) ?? "");
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to delete account");
                }
                toast.success("Account deleted successfully");
                get().fetchAccounts(missionName);
            } catch (error) {
                toast.error("Failed to delete account");
            }
        },
        addAccount: async (missionName: string, account: MissionAccountPost) => {
            try {
                const response = await postMissionAccount(missionName, account);
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to add account");
                }
                toast.success("Account added successfully");
                get().fetchAccounts(missionName);
				set({ addOpen: false });
            } catch (error) {
                toast.error("Failed to add account");
            }
        },
        approveAccount: async (missionName: string, account: MissionAccount) => {
            try {
                const response = await approveMissionAccount(missionName, account.name.split("/").at(-1) ?? "");
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to approve account");
                }
                toast.success("Account approved successfully");
                get().fetchAccounts(missionName);
            } catch (error) {
                toast.error("Failed to approve account");
            }
        },
        rejectAccount: async (missionName: string, account: MissionAccount) => {
            try {
                const response = await rejectMissionAccount(missionName, account.name.split("/").at(-1) ?? "");
                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Failed to reject account");
                }
                toast.success("Account rejected successfully");
                get().fetchAccounts(missionName);
            } catch (error) {
                toast.error("Failed to reject account");
            }
        },
    }),
);
