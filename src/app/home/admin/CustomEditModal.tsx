import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";
import { useTheme } from "next-themes";

interface EditModalProps<T> {
    isOpen: boolean;
    title: string;
    onOpenChange: () => void;
    onUpdate?: (data: T) => Promise<void>;
    onCreate?: (data: T) => Promise<void>;
    children: React.ReactNode;
    data: T | null;
    createButtonText?: string;
    updateButtonText?: string;
}

export default function CustomEditModal<T>({
    isOpen,
    onOpenChange,
    title,
    children,
    data,
    onUpdate,
    onCreate,
    createButtonText = "Create",
    updateButtonText = "Update",
}: EditModalProps<T>) {
    const { resolvedTheme } = useTheme();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filteredData = Object.fromEntries(
            Array.from(e.currentTarget.querySelectorAll("input, textarea"))
                .filter((element) =>
                    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
                        ? (element.type === "text" || element.tagName.toLowerCase() === "textarea") &&
                          element.value.trim() !== ""
                        : false,
                )
                .filter((element) => {
                    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                        return element.name !== "";
                    }
                    return (element as HTMLInputElement).name !== "";
                })
                .map((element) => {
                    const input = element as HTMLInputElement | HTMLTextAreaElement;
                    const { name, value, type } = input;

                    if (type === "checkbox") {
                        return [name, (input as HTMLInputElement).checked];
                    }

                    if (
                        value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?[+-]\d{2}:\d{2}\[[\w/]+\]$/) &&
                        type === "text"
                    ) {
                        return [name, parseZonedDateTime(value).toDate().toISOString()];
                    }

                    return [name, value];
                }),
        );

        if (data && onUpdate) {
            await onUpdate(filteredData as unknown as T);
        } else if (!data && onCreate) {
            await onCreate(filteredData as unknown as T);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior="inside">
            <Form onSubmit={onSubmit} validationBehavior="native">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                            <ModalBody className="grid grid-cols-1 gap-4" data-color-mode={resolvedTheme}>
                                {children}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" type="submit">
                                    {data ? updateButtonText : createButtonText}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Form>
        </Modal>
    );
}
