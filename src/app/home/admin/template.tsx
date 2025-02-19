import { auth } from "@/auth/server";
import { redirect } from "next/navigation";

export default async function AdminTemplate({ children }: { children: React.ReactNode }) {
    await auth("/", ["mission.admin"]);
    return children;
}
