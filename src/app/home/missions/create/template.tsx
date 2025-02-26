import { auth } from "@/auth/server";

export default async function CreateMissionTemplate({ children }: { children: React.ReactNode }) {
    await auth({ redirectUrl: "/missions" });
    return children;
}
