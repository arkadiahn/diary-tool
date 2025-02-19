import { auth } from "@/auth/server";

export default async function AdminTemplate({ children }: { children: React.ReactNode }) {
    await auth("/", ["mission.admin"]);
    return children;
}
