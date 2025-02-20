import { auth } from "@/auth/server";
import { redirect } from "next/navigation";

export default async function CreateMissionLayout({ children }: { children: React.ReactNode }) {
    const { session } = await auth();
    if (!session) {
        redirect("/missions");
    }
    return children;
}
