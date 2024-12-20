"use client";

import CustomIcon from "@/components/common/CustomIcon";
import type { IconifyIcon } from "@iconify/types";
import { signInServer } from "@arkadia/cnauth";
import { Button } from "@nextui-org/react";

export interface LoginButtonProps {
	redirectUrl?: string;
    providerKey: string;
    icon: IconifyIcon;
    name: string;
}

export function LoginButton({ name, icon, providerKey, redirectUrl }: LoginButtonProps) {
    const onSignIn = () => {
        signInServer(providerKey, redirectUrl || "/");
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
