"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

let globalConfirm: ((message?: string, title?: string) => Promise<boolean>) | null = null;

export const confirm = (message?: string, title?: string): Promise<boolean> => {
    if (!globalConfirm) {
        throw new Error("AreYouSure component not mounted");
    }
    return globalConfirm(message, title);
};

export const AreYouSure = () => {
    const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);
    const [message, setMessage] = useState("Are you sure you want to delete this item?");
    const [title, setTitle] = useState("Are you sure?");
    const [isOpen, setIsOpen] = useState(false);

    const confirmFn = useCallback((customMessage?: string, customTitle?: string): Promise<boolean> => {
        customMessage && setMessage(customMessage);
        customTitle && setTitle(customTitle);
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolveRef(() => resolve);
        });
    }, []);

    useEffect(() => {
        globalConfirm = confirmFn;
        return () => {
            globalConfirm = null;
        };
    }, [confirmFn]);

    const handleClose = useCallback(
        (result: boolean) => {
            setIsOpen(false);
            resolveRef?.(result);
            setResolveRef(null);
        },
        [resolveRef],
    );

    return (
        <Modal isOpen={isOpen} onClose={() => handleClose(false)} size="sm">
            <ModalContent>
                <ModalHeader>
                    <h1>{title}</h1>
                </ModalHeader>
                <ModalBody>
                    <p>{message}</p>
                </ModalBody>
                <ModalFooter>
                    <Button onPress={() => handleClose(false)} size="sm">
                        Cancel
                    </Button>
                    <Button onPress={() => handleClose(true)} color="danger" size="sm">
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

AreYouSure.displayName = "AreYouSure";
