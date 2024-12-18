"use client";

import { Icon } from "@iconify/react";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

export default function ProjectDetailView() {
    return (
        <>
            <div className="w-full p-6">
                <Breadcrumbs
                    size="lg"
                    className="mb-6"
                    itemClasses={{
                        item: "text-default-600",
                        separator: "text-default-400",
                    }}
                >
                    <BreadcrumbItem href="/">MissionBoard</BreadcrumbItem>
                    <BreadcrumbItem>Projekt Name</BreadcrumbItem>
                </Breadcrumbs>

                <div className="bg-content1 rounded-large p-6 shadow-small">
                    {/* Project detail content will go here */}
                    <h1 className="text-2xl font-bold mb-4">Projekt Name</h1>
                    {/* Add more project details as needed */}
                </div>
            </div>
        </>
    );
}
