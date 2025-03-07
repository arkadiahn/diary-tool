import type { Account } from "@arkadiahn/apis/intra/v1/account_pb";
import webClient from "@/api";

import createCustomStore from "../CreateCustomStore";
import { toast } from "react-hot-toast";

type UserStore = {
    users: Account[];
    loading: boolean;
    fetchUsers: () => Promise<void>;
	deleteUser: (user: Account) => Promise<void>;
};

export const { StoreProvider: UserStoreProvider, useStore: useUserStore } = createCustomStore<UserStore>(
    (set, get) => ({
        users: [],
        loading: true,
        fetchUsers: async () => {
            set({ loading: true });
			const { accounts } = await webClient.listAccounts({
				showDeleted: true
			});
            set({ users: accounts, loading: false });
        },
		deleteUser: async (user: Account) => {
			try {
				await webClient.deleteAccount({
					name: user.name
				});
				toast.success("User deleted successfully");
				get().fetchUsers();
			} catch (error) {
				console.error(error);
				toast.error("Failed to delete user");
			}
		},
    }),
);
