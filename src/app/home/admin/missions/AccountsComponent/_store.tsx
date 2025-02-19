import { type Account, getAccounts } from "@/api/missionboard";
import Fuse from "fuse.js";
import { create } from "zustand";

interface AccountsComponentStore {
    allAccounts: Account[];
    filteredAccounts: Account[];
    accountsMap: Map<string, Account>;
    fuse: Fuse<Account>;
    inputValue: string;
    selectedAccount: React.Key | null;
    loading: boolean;
    fetchAccounts: () => Promise<void>;
    setInputValue: (value: string) => void;
    selectAccount: (value: React.Key | null) => void;
    formatAccountText: (account: Account) => string;
}

export const useAccountsComponentStore = create<AccountsComponentStore>((set, get) => ({
    allAccounts: [],
    filteredAccounts: [],
    accountsMap: new Map(),
    fuse: new Fuse<Account>([], {
        keys: [
            "nick_name",
            "email",
            "name",
            {
                name: "combined",
                getFn: (user) => `${user.nick_name} - ${user.email}`,
            },
        ],
        threshold: 0.4,
        shouldSort: false,
    }),
    inputValue: "",
    selectedAccount: null,
    loading: true,
    fetchAccounts: async () => {
        try {
            set({ loading: true });
            const response = await getAccounts();
            const accountsMap = new Map(
                (response.data.accounts as Account[]).map((account) => [account.name, account]),
            );

            get().fuse.setCollection(Array.from(accountsMap.values()));
            set({
                filteredAccounts: Array.from(accountsMap.values()),
                accountsMap,
                loading: false,
            });
        } catch {
            set({ loading: false });
        }
    },
    setInputValue: (value: string) => {
        const { fuse, allAccounts, selectedAccount } = get();
        if (value === selectedAccount) {
            return;
        }
        set({
            inputValue: value,
            selectedAccount: value === "" ? null : selectedAccount,
            filteredAccounts: value ? fuse.search(value.toString()).map((result) => result.item) : allAccounts,
        });
    },
    selectAccount: (value: React.Key | null) => {
        const { accountsMap, fuse, allAccounts, selectedAccount, formatAccountText } = get();
        const account = value ? accountsMap.get(value.toString()) : null;
        if (value === selectedAccount) {
            return;
        }
        set({
            inputValue: account ? formatAccountText(account) : "",
            selectedAccount: value,
            filteredAccounts: value ? fuse.search(value.toString()).map((result) => result.item) : allAccounts,
        });
    },
    formatAccountText: (account: Account) => {
        return `${account.nick_name} - ${account.email}`;
    },
}));
