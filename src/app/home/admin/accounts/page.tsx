"use client";

import type { Account } from "@arkadiahn/apis/intra/v1/account_pb";

import { Button } from "@heroui/react";
import type { ICellRendererParams } from "ag-grid-community";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import CustomGrid from "../CustomGrid";
import { UserStoreProvider, useUserStore } from "./_accountsStore";
import { timestampToDate } from "@/api/utils";

function Accounts() {
    const fetchUsers = useUserStore((state) => state.fetchUsers);
	const deleteUser = useUserStore((state) => state.deleteUser);
    const loading = useUserStore((state) => state.loading);
    const users = useUserStore((state) => state.users);

    useEffect(() => {
        fetchUsers();
    }, []);

    const impersonate = async (name: string) => {
        const resp = await fetch(`/api/impersonate?name=${name.split("/").at(-1)}`, {
            method: "POST",
            credentials: "include",
        });
        if (resp.ok) {
            window.location.href = "/";
        } else {
            toast.error("Failed to impersonate user");
        }
    };

    return (
        <main className="h-full w-full flex flex-col items-center justify-center p-4">
            <CustomGrid
                data={users}
                loading={loading}
                tableTitle="Accounts"
				onDelete={deleteUser}
                columnDefs={[
                    { field: "name", headerName: "Name", width: 120 },
                    { field: "nick", headerName: "Nickname", pinned: "left" },
                    { field: "email", headerName: "Email" },
                    // {
                    //     field: "lastLoginTime",
                    //     headerName: "Last Login",
                    //     valueFormatter: (params) => new Date(params.value).toLocaleString(),
                    // },
                    {
                        field: "createTime",
                        headerName: "Created",
                        valueFormatter: (params) => timestampToDate(params.value)?.toLocaleString() ?? "",
                    },
                    {
                        field: "updateTime",
                        headerName: "Updated",
                        valueFormatter: (params) => timestampToDate(params.value)?.toLocaleString() ?? "",
                    },
					{
                        field: "deleteTime",
                        headerName: "Deleted",
                        valueFormatter: (params) => timestampToDate(params.value)?.toLocaleString() ?? "",
                    },
                    {
                        headerName: "Impersonate",
                        filter: false,
                        sortable: false,
                        maxWidth: 130,
                        cellRenderer: (params: ICellRendererParams<Account>) => {
                            return (
                                <div className="flex h-full items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        color="warning"
                                        onPress={() => impersonate(params.data?.name ?? "")}
                                    >
                                        Impersonate
                                    </Button>
                                </div>
                            );
                        },
                    },
                ]}
            />
        </main>
    );
}

export default function AccountsWrapper() {
    return (
        <UserStoreProvider>
            <Accounts />
        </UserStoreProvider>
    );
}
