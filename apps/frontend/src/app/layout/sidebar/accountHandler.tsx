import CustomIcon from "@/app/components/common/CustomIcon";
import { Avatar, Button } from "@nextui-org/react";
// import { auth } from "@/config/auth";

/* ---------------------------------- Icons --------------------------------- */
import icRoundLogout from "@iconify/icons-ic/round-logout";
import icRoundLogin from "@iconify/icons-ic/round-login";
import { auth } from "@arkadia/cnauth/server";


export default async function AccountHandler() {
    const session = await auth();

    return (
        <div className="mt-auto flex flex-col gap-2">
            {session && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <Avatar
                            size="sm"
                            src={session.user.imageURL}
                        />
                        <div className="flex flex-col">
                            <p className="text-small font-medium text-default-600">
                                {session.user.nickName}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <Button
				as="a"
				href={`${process.env.NEXT_PUBLIC_AUTH_URL}`}
                className="justify-start text-default-500 data-[hover=true]:text-foreground"
                startContent={
                    <CustomIcon
                        className="rotate-180 text-default-500"
                        icon={session ? icRoundLogout : icRoundLogin}
                        width={24}
                    />
                }
                variant="light"
            >
                {session ? "Log Out" : "Log In"}
            </Button>
        </div>
    );
}
