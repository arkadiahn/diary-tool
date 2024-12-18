import { Avatar, Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

interface AccountHandlerProps {
    onLogin: () => void;
}

export default function AccountHandler({ onLogin }: AccountHandlerProps) {
    const loggedIn = false;

    return (
        <div className="mt-auto flex flex-col gap-2">
            {loggedIn && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <Avatar
                            size="sm"
                            src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                        />
                        <div className="flex flex-col">
                            <p className="text-small font-medium text-default-600">
                                John Doe
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <Button
                className="justify-start text-default-500 data-[hover=true]:text-foreground"
                startContent={
                    <Icon
                        className="rotate-180 text-default-500"
                        icon={loggedIn ? "ic:round-logout" : "ic:round-login"}
                        width={24}
                    />
                }
                variant="light"
                onPress={loggedIn ? () => {} : onLogin}
            >
                {loggedIn ? "Log Out" : "Log In"}
            </Button>
        </div>
    );
}
