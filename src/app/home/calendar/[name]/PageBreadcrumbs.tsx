"use client";

import { BreadcrumbItem, Link } from "@heroui/react";
import { Breadcrumbs } from "@heroui/react";

interface PageBreadcrumbsProps {
    title: string;
}

export default function PageBreadcrumbs({ title }: PageBreadcrumbsProps) {
    return (
        <Breadcrumbs size="lg" className="self-start font-semibold">
            <BreadcrumbItem href="/calendar">Calendar</BreadcrumbItem>
            <BreadcrumbItem>{title}</BreadcrumbItem>
        </Breadcrumbs>
    );
}
