import type { Metadata } from "next";
import { siteConfig } from "../src/constants/siteConfig";

/* -------------------------------------------------------------------------- */
/*                                  Metadata                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
    title: `${siteConfig.name} - Calendar`,
    description: siteConfig.description,
};

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */
export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
