"use client";

import { signIn, signOut } from "@/auth/client";
import CustomIcon from "@/components/CustomIcon";
import SidebarItem from "../sidebarItem";

import icRoundLogin from "@iconify/icons-ic/round-login";
/* ---------------------------------- Icons --------------------------------- */
import icRoundLogout from "@iconify/icons-ic/round-logout";

interface AccountButtonProps {
    type: "login" | "logout";
}
export default function AccountButton({ type }: AccountButtonProps) {
    return (
        <SidebarItem
            onClick={() => (type === "login" ? signIn() : signOut())}
            leading={
                <CustomIcon className="w-[22px]" icon={type === "login" ? icRoundLogin : icRoundLogout} width={22} />
            }
            label={type === "login" ? "Login" : "Logout"}
        />
    );
}
