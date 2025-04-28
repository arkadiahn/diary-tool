import { signIn } from "@/auth/client";
import { Button } from "@heroui/react";

export default function LoginButton() {
    return (
        <Button color="primary" variant="flat" radius="lg" onPress={signIn}>
			Login
		</Button>
    )
}
