"use client";

import { signIn } from "@/auth/client";
import { Button } from "@heroui/react";


export default function LoginButton() {
	return (
		<Button radius="full" color="primary" variant="flat" onPress={() => signIn()}>
            Login
		</Button>
	);
}
