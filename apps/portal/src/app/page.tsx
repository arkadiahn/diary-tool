import { AUTH_PROVIDERS } from "@constants/auth";
import { LoginButton } from "@components/auth/LoginButton";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import { siteConfig } from "@/constants/site";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center p-5">
                <div className="w-full max-w-sm">
                    <AuthCard />
                </div>
            </main>

            <Footer />
        </div>
    );
}

function AuthCard() {
    return (
        <div className="flex flex-col gap-20 sm:gap-8 rounded-large sm:bg-content1 sm:px-8 pb-10 pt-6 sm:shadow-large">
            <WelcomeSection />
            <AuthProviders />
        </div>
    );
}

function WelcomeSection() {
    return (
        <div className="flex flex-col items-center">
            <Image
                src="/logo.png"
                alt={`${siteConfig.name} Logo`}
                width={90}
                height={90}
                className="w-20 sm:w-16"
            />
            <h1 className="text-4xl sm:text-2xl font-medium">Welcome</h1>
            <p className="text-lg sm:text-small text-default-500">
                Login to get started
            </p>
        </div>
    );
}

function AuthProviders() {
    return (
        <div className="flex flex-col gap-2">
            {AUTH_PROVIDERS.map((provider) => (
                <LoginButton key={provider.name} {...provider} />
            ))}
        </div>
    );
}
