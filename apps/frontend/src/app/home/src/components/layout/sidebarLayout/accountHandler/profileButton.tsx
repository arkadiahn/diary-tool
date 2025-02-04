"use client";

import { useRouter } from "next/navigation";
import SidebarItem from "../sidebarItem";
import { Session } from "@/auth/models";
import { Avatar } from "@heroui/react";


interface ProfileButtonProps {
	session: Session;
}
export default function ProfileButton({ session }: ProfileButtonProps) {
	const router = useRouter();

	return (
		<SidebarItem
			onClick={() => {
				router.push(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/account`);
			}}
			leading={<Avatar size="sm" isBordered src={session.user.picture} alt={session.user.name} />}
			trailing={<>
				<div className="inline-flex flex-col items-start ml-3 subpixel-antialiased">
					<span className="text-small text-inherit">
						{session.user.name}
					</span>
					<span className="text-tiny text-foreground-400">
						{session.user.email}
					</span>
				</div>
			</>}
			className="!p-2"
		/>
	);
}
