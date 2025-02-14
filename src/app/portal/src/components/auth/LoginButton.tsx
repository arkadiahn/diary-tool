"use client";

import type { IconifyIcon } from "@iconify/types";
import CustomIcon from "@/components/CustomIcon";
import { Button } from "@heroui/react";

export interface LoginButtonProps {
	redirectUrl?: string;
    providerKey: string;
    icon: IconifyIcon;
    name: string;
}

export function LoginButton({ name, icon, providerKey, redirectUrl }: LoginButtonProps) {
    const onSignIn = () => {
    };

    return (
        <Button
            startContent={<CustomIcon icon={icon} width={24} />}
            variant="bordered"
            onPress={onSignIn}
            fullWidth
        >
            Continue with {name}
        </Button>
    );
}
