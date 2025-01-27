"use client";

import CustomIcon from "@/components/CustomIcon";
import { signIn, signOut } from "@/auth/client";
import { Session } from "@/auth/models";
import SidebarItem from "./sidebarItem";
import { Avatar } from "@heroui/react";

/* ---------------------------------- Icons --------------------------------- */
import icRoundLogout from "@iconify/icons-ic/round-logout";
import icRoundLogin from "@iconify/icons-ic/round-login";


interface AccountHandlerProps {
	session: Session | null;
}
export default function AccountHandler({ session }: AccountHandlerProps) {
	return (
		<>
			{session && (
				<SidebarItem
					leading={<Avatar size="sm" src={session.user.picture} alt={session.user.name} />}
					trailing={<>
						<p className="ml-3 text-small font-medium text-default-700">
							{session.user.name}
						</p>
					</>}
				/>
            )}
			{session && (
				<SidebarItem
					onClick={() => signOut()}
					leading={<CustomIcon className="w-[22px]" icon={icRoundLogout} width={22} />}
					trailing={<h1 className="font-bold">Logout</h1>}
				/>
			)}
			{!session && (
				<SidebarItem
					onClick={() => signIn()}
					leading={<CustomIcon className="w-[22px]" icon={icRoundLogin} width={22} />}
					trailing={<h1 className="font-bold">Login</h1>}
				/>
			)}
		</>
    );
}
