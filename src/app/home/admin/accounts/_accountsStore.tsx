import { type Account, getAccounts } from "@/api/missionboard";
import createCustomStore from "../CreateCustomStore";

type UserStore = {
    users: Account[];
    loading: boolean;
    fetchUsers: () => Promise<void>;
};

export const { StoreProvider: UserStoreProvider, useStore: useUserStore } = createCustomStore<UserStore>(
    (set, _get) => ({
        users: [],
        loading: true,
        fetchUsers: async () => {
            set({ loading: true });
            const response = await getAccounts();
            set({ users: response.data.accounts as Account[], loading: false });
        },
    }),
);
