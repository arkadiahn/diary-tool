"use client";

import CustomIcon from "@/components/CustomIcon";
import { Card, CardBody, CardHeader, type CardProps, Image } from "@heroui/react";
import assignment from "@iconify/icons-ic/outline-assignment";
import calendarMonth from "@iconify/icons-ic/outline-calendar-month";
import { LazyMotion, domAnimation, m, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef } from "react";
import MainPageLayout from "./src/components/MainPageLayout";

function SpotlightCard(props: CardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const cardRef = useRef<HTMLDivElement>(null);

    function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!cardRef?.current) {
            return;
        }

        const { left, top } = cardRef.current?.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Card
            {...props}
            ref={cardRef}
            className="group relative w-[530px] h-[620px] bg-neutral-900 shadow-large"
            radius="lg"
            onMouseMove={onMouseMove}
        >
            <LazyMotion features={domAnimation}>
                <m.div
                    className="pointer-events-none absolute -inset-px rounded-large opacity-0 transition duration-250 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
			  radial-gradient(
				450px circle at ${mouseX}px ${mouseY}px,
				rgba(120, 40, 200, 0.2),
				transparent 80%
			  )
			`, // <- Add your own color here
                    }}
                />
            </LazyMotion>
            <CardHeader className="relative h-60 p-0 justify-center">
                <Image
                    removeWrapper={true}
                    alt="Acme Planner"
                    className="h-full object-cover"
                    src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/calendar.png"
                    style={{
                        WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)",
                    }}
                />
            </CardHeader>
            <CardBody className="px-6 pb-8 pt-4">
                <div className="flex flex-col gap-2">
                    <p className="text-xl text-neutral-50">Get started with Acme Planner</p>
                    <p className="text-small text-neutral-400">
                        Outline, monitor, and deliver extensive work elements from inception to completion using project
                        management and strategic roadmaps.
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}

export default function Home() {
    return (
        <MainPageLayout className="justify-center gap-16">
            <header>
                <h1 className="text-7xl font-bold text-center">Home</h1>
            </header>
            <main>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    <SpotlightCard
                    // icon={calendarMonth}
                    // title="Calendar"
                    // subtitle="Manage your schedule efficiently"
                    // description="Stay organized with our intuitive calendar system. Schedule meetings, set reminders, and coordinate with your team seamlessly. Our powerful calendar tools help you stay on top of your commitments and make the most of your time."
                    />
                    <SpotlightCard
                    // icon={assignment}
                    // title="Mission Control"
                    // subtitle="Project management simplified"
                    // description="Track projects, assign tasks, and monitor progress all in one place. Streamline your workflow with our comprehensive project management tools. Keep your team aligned and projects on track with our powerful mission control center."
                    />
                </div>
            </main>
        </MainPageLayout>
    );
}
