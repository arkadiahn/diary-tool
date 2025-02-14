import { auth } from "@/auth/server";
import Sidebar from "./sidebar";
import SidebarItem from "./sidebarItem";

import { AcmeIcon } from "./acme";

import solarCalendarLinear from "@iconify/icons-solar/calendar-linear";
/* ---------------------------------- Icons --------------------------------- */
import solarDocumentsLinear from "@iconify/icons-solar/documents-linear";
import solarHomeLinear from "@iconify/icons-solar/home-linear";

interface SidebarLayoutProps {
    children: React.ReactNode;
}
export default async function SidebarLayout({ children }: SidebarLayoutProps) {
    const { session } = await auth();

    return (
        <Sidebar
            adminItems={[
                {
                    icon: solarDocumentsLinear,
                    label: "Events",
                    href: "/admin/events",
                },
            ]}
            items={[
                {
                    icon: solarHomeLinear,
                    label: "Home",
                    href: "/",
                },
                {
                    icon: solarDocumentsLinear,
                    label: "Missions",
                    href: "/missions",
                },
                {
                    icon: solarCalendarLinear,
                    label: "Calendar",
                    href: "/calendar",
                },
            ]}
            logoItem={
                <SidebarItem
                    leading={<AcmeIcon size={38} />}
                    trailing={<h1 className="text-xl font-bold">OpenSpace</h1>}
                />
            }
            session={session}
        >
            {children}
        </Sidebar>
    );
}
