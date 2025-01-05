import AuthProviders from "@/components/auth/AuthProviders";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import { siteConfig } from "@/constants/site";
import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="flex min-h-dvh flex-col">
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
			<Suspense fallback={
				<div className="flex flex-col gap-2">
					<Spinner />
				</div>
			}>
                <AuthProviders />
            </Suspense>
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
