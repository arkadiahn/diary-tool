"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useAccountsComponentStore } from "./_store";
import { useEffect } from "react";


interface AccountsComponentProps {
    defaultAccount?: string;
    title: string;
    name: string;
}

export default function AccountsComponent({ defaultAccount, title, name }: AccountsComponentProps) {
    const fetchAccounts = useAccountsComponentStore((state) => state.fetchAccounts);
    const filteredAccounts = useAccountsComponentStore((state) => state.filteredAccounts);
    const loadingAccounts = useAccountsComponentStore((state) => state.loading);
    const inputValue = useAccountsComponentStore((state) => state.inputValue);
    const setInputValue = useAccountsComponentStore((state) => state.setInputValue);
    const selectedAccount = useAccountsComponentStore((state) => state.selectedAccount);
    const selectAccount = useAccountsComponentStore((state) => state.selectAccount);
	const formatAccountText = useAccountsComponentStore((state) => state.formatAccountText);

    useEffect(() => {
        fetchAccounts().then(() => {
            selectAccount(defaultAccount ?? null);
        });
    }, [defaultAccount]);

    return (
        <>
            <input name={name} value={(selectedAccount as string) ?? ""} readOnly={true} className="hidden" />
            <Autocomplete
                size="sm"
                label={title}
                items={filteredAccounts}
                isLoading={loadingAccounts}
                isRequired={true}
                isClearable={false}
                itemHeight={45}
                inputValue={inputValue}
                onInputChange={setInputValue}
                selectedKey={selectedAccount as string}
                onSelectionChange={selectAccount}
            >
                {(account) => (
                    <AutocompleteItem key={account.name} textValue={formatAccountText(account)}>
                        <div className="flex flex-col justify-between items-start">
                            <span className="text-foreground/40">{account.name}</span>
                            <span>
								{formatAccountText(account)}
                            </span>
                        </div>
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </>
    );
}
