import AccountButton from "./accountButton";
import SidebarItem from "../sidebarItem";
import { Avatar } from "@heroui/react";
import { auth } from "@/auth/server";


export default async function AccountHandler() {
	const { session } = await auth();

	return (
		<>
			{session && (
				<SidebarItem
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
            )}
			{session && <AccountButton type="logout" />}
			{!session && <AccountButton type="login" />}
		</>
    );
}
