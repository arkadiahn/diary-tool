import type { Metadata } from "next";
import { siteConfig } from "../src/constants/siteConfig";

/* -------------------------------------------------------------------------- */
/*                                  Metadata                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
    title: `${siteConfig.name} - Admin`,
    description: siteConfig.description,
};

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
