"use client";

import { usePathname, useRouter } from "next/navigation";
import CustomIcon from "@/components/CustomIcon";
import { signOut } from "@arkadia/cnauth/client";
import { Avatar } from "@heroui/react";
import { Session } from "@arkadia/cnauth";
import SidebarItem from "./sidebarItem";

/* ---------------------------------- Icons --------------------------------- */
import icRoundLogout from "@iconify/icons-ic/round-logout";
import icRoundLogin from "@iconify/icons-ic/round-login";


interface AccountHandlerProps {
	session: Session | null;
}
export default function AccountHandler({ session }: AccountHandlerProps) {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<>
			{session && (
				<SidebarItem
					leading={<Avatar size="sm" src={session.user.imageURI} alt={session.user.nickName} />}
					trailing={<>
						<p className="ml-3 text-small font-medium text-default-700">
							{session.user.nickName}
						</p>
					</>}
				/>
            )}
			{session && (
				<SidebarItem
					onClick={() => signOut(`${process.env.NEXT_PUBLIC_FRONTEND_URL}`)}
					leading={<CustomIcon className="w-[22px]" icon={icRoundLogout} width={22} />}
					trailing={<h1 className="font-bold">Logout</h1>}
				/>
			)}
			{!session && (
				<SidebarItem
					// @todo fix library to push to auth url
					onClick={() => router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}?redirect=${pathname}`)}
					leading={<CustomIcon className="w-[22px]" icon={icRoundLogin} width={22} />}
					trailing={<h1 className="font-bold">Login</h1>}
				/>
			)}
		</>
    );
}
