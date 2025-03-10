import type { MissionAccount } from "@arkadiahn/apis/intra/v1/mission_account_pb";

import CustomEditModal from "../CustomEditModal";
import AccountsComponent from "./AccountsComponent";
import { useAccountStore } from "./_accountStore";

export default function EditMissionAccountModal() {
    const missionName = useAccountStore((state) => state.missionName);
    const addAccount = useAccountStore((state) => state.addAccount);
    const toggleAdd = useAccountStore((state) => state.toggleAdd);
    const addOpen = useAccountStore((state) => state.addOpen);

    return (
        <CustomEditModal
            isOpen={addOpen}
            onOpenChange={toggleAdd}
            title="Accounts Details"
            data={null}
            onCreate={async (data: MissionAccount) => await addAccount(missionName ?? "", data)}
            createButtonText="Add"
        >
            <AccountsComponent title="Account" name="account" />
        </CustomEditModal>
    );
}
