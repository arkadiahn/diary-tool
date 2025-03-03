import { auth } from "@/auth/server";

export default async function AdminTemplate({ children }: { children: React.ReactNode }) {
    await auth({ requiredScopes: ["mission.admin"], toLogin: true, redirectUrl: "/" });
    return children;
}
