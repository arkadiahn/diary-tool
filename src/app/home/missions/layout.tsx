import type { Metadata } from "next";
import { siteConfig } from "../src/constants/siteConfig";

/* -------------------------------------------------------------------------- */
/*                                  Metadata                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
    title: `${siteConfig.name} - MissionBoard`,
    description: siteConfig.description,
};

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */
export default function MissionsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
