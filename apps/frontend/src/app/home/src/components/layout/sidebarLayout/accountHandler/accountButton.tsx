"use client";

import CustomIcon from "@/components/CustomIcon";
import { signIn, signOut } from "@/auth/client";
import SidebarItem from "../sidebarItem";

/* ---------------------------------- Icons --------------------------------- */
import icRoundLogout from "@iconify/icons-ic/round-logout";
import icRoundLogin from "@iconify/icons-ic/round-login";


interface AccountButtonProps {
	type: "login" | "logout";
}
export default function AccountButton({ type }: AccountButtonProps) {
	return (
		<SidebarItem
			onClick={() => type === "login" ? signIn() : signOut()}
			leading={<CustomIcon className="w-[22px]" icon={type === "login" ? icRoundLogin : icRoundLogout} width={22} />}
			label={type === "login" ? "Login" : "Logout"}
		/>
	)
}
