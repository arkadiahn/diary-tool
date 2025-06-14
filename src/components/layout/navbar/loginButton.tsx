"use client";

import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";

export default function LoginButton() {
    return (
        <Button radius="full" color="primary" variant="flat" onPress={() => signIn("keycloak")}>
            Login
        </Button>
    );
}
