"use client";

import { signIn } from "next-auth/react";
import { Button } from "@heroui/react";

export default function LoginButton() {
    return (
        <Button radius="full" color="primary" variant="flat" onPress={() => signIn("keycloak")}>
            Login
        </Button>
    );
}
