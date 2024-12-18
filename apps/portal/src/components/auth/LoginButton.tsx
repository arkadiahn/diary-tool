"use client";

import CustomIcon from "@/components/common/CustomIcon";
import type { IconifyIcon } from "@iconify/types";
import { signInServer } from "@arkadia/cnauth";
import { Button } from "@nextui-org/react";

export interface LoginButtonProps {
    providerKey: string;
    icon: IconifyIcon;
    name: string;
}

export function LoginButton({ name, icon, providerKey }: LoginButtonProps) {
    const onSignIn = () => {
        signInServer(providerKey, "/");
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
