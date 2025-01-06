import CustomIcon from "@/app/components/common/CustomIcon";
import SidebarItemWrapper from "./sidebarItemWrapper";
import { Avatar, Button, cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Session } from "@arkadia/cnauth";

/* ---------------------------------- Icons --------------------------------- */
import icRoundLogout from "@iconify/icons-ic/round-logout";
import icRoundLogin from "@iconify/icons-ic/round-login";


interface AccountHandlerProps {
	isOpen: boolean;
	session: Session | null;
}
export default function AccountHandler({ isOpen, session }: AccountHandlerProps) {
	const router = useRouter();

	return (
		<>
			{session && (
                <div className="flex flex-col">
                    <div className={`p-1 flex items-center gap-3 lg:justify-start ${!isOpen ? "justify-center" : "justify-start"}`}>
                        <Avatar
                            size="sm"
                            src={session.user.imageURL}
                        />
                        <div className={`lg:flex flex-col ${!isOpen ? "hidden" : ""}`}>
                            <p className="text-small font-medium text-default-600">
                                {session.user.nickName}
                            </p>
                        </div>
                    </div>
                </div>
            )}
			{session && (
				<SidebarItemWrapper
					onClick={async () => {
						try {
							await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {
								method: 'POST',
								credentials: 'include',
							});
							router.refresh();
						} catch (error) {
							console.error('Logout failed:', error);
						}
					}}
					leading={<CustomIcon className="w-[22px]" icon={icRoundLogout} width={22} />}
					trailing={<h1 className="font-bold">Logout</h1>}
					forceBreakpoint={isOpen}
				/>
			)}
			{!session && (
				<SidebarItemWrapper
					onClick={() => router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}`)}
					leading={<CustomIcon className="w-[22px]" icon={icRoundLogin} width={22} />}
					trailing={<h1 className="font-bold">Login</h1>}
					forceBreakpoint={isOpen}
				/>
			)}
		</>
    );
}
