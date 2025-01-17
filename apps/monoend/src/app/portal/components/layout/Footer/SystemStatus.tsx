"use client";

import { Chip } from "@nextui-org/react";

export default function SystemStatus() {
    return (
        <Chip
            className="border-none px-0 text-default-500"
            color="success"
            variant="dot"
        >
            All systems operational
        </Chip>
    );
}
