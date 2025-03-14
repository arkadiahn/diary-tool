import webClient from "@/api";
import { createFieldMask } from "@/api/utils";
import type { MissionAccount } from "@arkadiahn/apis/intra/v1/mission_account_pb";

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
    addAccount: (missionName: string, account: MissionAccount) => Promise<void>;
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
                const { missionAccounts } = await webClient.listMissionAccounts({
                    parent: missionName,
                });
                set({ accounts: missionAccounts, missionName, loading: false });
            } catch {
                toast.error("Failed to fetch accounts");
                set({ loading: false });
            }
        },
        removeAccount: async (missionName: string, account: MissionAccount) => {
            const result = await confirm("Are you sure you want to delete this account?", "Delete Account");
            if (!result) {
                return;
            }
            try {
                await webClient.deleteMissionAccount({
                    name: account.name,
                });
                toast.success("Account deleted successfully");
                get().fetchAccounts(missionName);
            } catch {
                toast.error("Failed to delete account");
            }
        },
        addAccount: async (missionName: string, account: MissionAccount) => {
            try {
                await webClient.createMissionAccount({
                    parent: missionName,
                    missionAccount: account,
                });
                toast.success("Account added successfully");
                get().fetchAccounts(missionName);
                set({ addOpen: false });
            } catch {
                toast.error("Failed to add account");
            }
        },
        approveAccount: async (missionName: string, account: MissionAccount) => {
            try {
                account.approved = true;
                await webClient.updateMissionAccount({
                    missionAccount: account,
                    updateMask: createFieldMask(account),
                });
                toast.success("Account approved successfully");
                get().fetchAccounts(missionName);
            } catch {
                toast.error("Failed to approve account");
            }
        },
        rejectAccount: async (missionName: string, account: MissionAccount) => {
            const result = await confirm("Are you sure you want to reject this account?", "Reject Account");
            if (!result) {
                return;
            }
            try {
                await get().removeAccount(missionName, account);
                toast.success("Account rejected successfully");
                get().fetchAccounts(missionName);
            } catch {
                toast.error("Failed to reject account");
            }
        },
    }),
);
