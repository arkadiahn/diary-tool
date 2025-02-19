import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";

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
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filteredData = Object.fromEntries(
            Array.from(e.currentTarget.getElementsByTagName("input")).map((input) => {
                const { name, value, type, checked } = input;

                if (type === "checkbox") {
                    return [name, checked];
                }

                if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?[+-]\d{2}:\d{2}\[[\w/]+\]$/)) {
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
                            <ModalBody className="grid grid-cols-1 gap-4">{children}</ModalBody>
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
