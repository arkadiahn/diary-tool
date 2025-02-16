import { auth } from "@/auth/server";
import Sidebar from "./sidebar";

import solarCalendarLinear from "@iconify/icons-solar/calendar-linear";
/* ---------------------------------- Icons --------------------------------- */
import solarDocumentsLinear from "@iconify/icons-solar/documents-linear";
import solarHomeLinear from "@iconify/icons-solar/home-linear";
import Image from "next/image";
import Link from "next/link";

function Logo() {
    return (
        <Link href="/">
            <Image
                src="/osWortmarke.png"
                alt="OpenSpace"
                className="dark:invert hidden lg:block"
                height={65}
                width={170}
                priority={true}
            />
        </Link>
    );
}
function LogoMobile() {
    return (
        <Link href="/">
            <Image
                src="/osLogo.png"
                alt="OpenSpace"
                className="dark:invert lg:hidden"
                height={30}
                width={50}
                priority={true}
            />
        </Link>
    );
}

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
            sidebarLogo={
                <div className="flex items-center p-1 h-[38px]">
                    <Logo />
                    <LogoMobile />
                </div>
            }
            headerLogo={<Logo />}
            session={session}
        >
            {children}
        </Sidebar>
    );
}
