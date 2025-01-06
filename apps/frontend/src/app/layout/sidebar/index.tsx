import { IconifyIcon } from "@/app/components/common/CustomIcon";
import { auth } from "@arkadia/cnauth/server";
import Sidebar from "./sidebar";


interface SidebarProps {
	items: {
		icon: IconifyIcon;
		label: string;
		href: string;
    }[];
}
export default async function SidebarWrapper({ items }: SidebarProps) {
	const session = await auth();

	return (
		<Sidebar 
			items={items}
			session={session}
		/>
	)
}
