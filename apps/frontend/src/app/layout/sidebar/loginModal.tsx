"use client";

import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { Icon } from "@iconify/react";
import { AcmeIcon } from "./acme";

interface LoginModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
export default function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalBody className="items-center py-5">
                        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
                            <div className="flex flex-col items-center pb-2.5">
                                <AcmeIcon size={60} />
                                <p className="text-xl font-medium">Welcome</p>
                                <p className="text-small text-default-500">
                                    Create an account or login
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    startContent={
                                        <Icon
                                            icon="flat-color-icons:google"
                                            width={24}
                                        />
                                    }
                                    onPress={() => signIn("google")}
                                    variant="bordered"
                                >
                                    Continue with Google
                                </Button>
                                <Button
                                    startContent={
                                        <Icon
                                            className="text-default-500"
                                            icon="fe:github"
                                            width={24}
                                        />
                                    }
                                    onPress={() => signIn("github")}
                                    variant="bordered"
                                >
                                    Continue with Github
                                </Button>
                            </div>
                            <p className="text-center text-small">
                                Already have an account?&nbsp;
                                <Link href="#" size="sm">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
