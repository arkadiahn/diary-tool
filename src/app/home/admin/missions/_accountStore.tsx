import {
    type MissionAccount,
    type MissionAccountPost,
    approveMissionAccount,
    deleteMissionAccount,
    getMissionAccounts,
    postMissionAccount,
    rejectMissionAccount,
} from "@/api/missionboard";
import { toast } from "react-hot-toast";
import { confirm } from "../AreYouSurePopup";
import createCustomStore from "../CreateCustomStore";

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
                set({ accounts: response.data, missionName, loading: false });
            } catch {
                toast.error("Failed to fetch accounts");
                set({ loading: false });
            }
        },
        removeAccount: async (missionName: string, account: MissionAccount) => {
            const result = await confirm("Are you sure you want to delete this account?", "Delete Account");
            if (!result) return;
            try {
                await deleteMissionAccount(missionName, account.name);
                toast.success("Account deleted successfully");
                get().fetchAccounts(missionName);
            } catch {
                toast.error("Failed to delete account");
            }
        },
        addAccount: async (missionName: string, account: MissionAccountPost) => {
            try {
                await postMissionAccount(missionName, account);
                toast.success("Account added successfully");
                get().fetchAccounts(missionName);
                set({ addOpen: false });
            } catch {
                toast.error("Failed to add account");
            }
        },
        approveAccount: async (missionName: string, account: MissionAccount) => {
            try {
                await approveMissionAccount(missionName, account.name);
                toast.success("Account approved successfully");
                get().fetchAccounts(missionName);
            } catch {
                toast.error("Failed to approve account");
            }
        },
        rejectAccount: async (missionName: string, account: MissionAccount) => {
            const result = await confirm("Are you sure you want to reject this account?", "Reject Account");
            if (!result) return;
            try {
                await rejectMissionAccount(missionName, account.name);
                toast.success("Account rejected successfully");
                get().fetchAccounts(missionName);
            } catch {
                toast.error("Failed to reject account");
            }
        },
    }),
);
