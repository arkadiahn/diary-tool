"use client";

import { Chip } from "@heroui/react";
import { useEffect, useState } from "react";

export default function SystemStatus() {
    const [isOnline, setIsOnline] = useState(true);

    // useEffect(() => {
    //     const checkStatus = async () => {
    //         try {
    //             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
    //             setIsOnline(response.ok);
    //         } catch {
    //             setIsOnline(false);
    //         }
    //     };
    //     checkStatus();
    // }, []);

    if (!isOnline) {
        return (
            <Chip className="border-none px-0 text-default-600" color="danger" variant="dot">
                Some systems are offline
            </Chip>
        );
    }

    return (
        <Chip className="border-none px-0 text-default-600" color="success" variant="dot">
            All systems operational
        </Chip>
    );
}
