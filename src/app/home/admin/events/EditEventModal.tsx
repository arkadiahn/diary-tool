import { type Event, patchEvent } from "@/api/missionboard";
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

interface EditEventModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event | null;
    onEventUpdate: (updatedEvent: Event) => void;
}

export function EditEventModal({ isOpen, onOpenChange, event, onEventUpdate }: EditEventModalProps) {
    if (!event) {
        return null;
    }

    // @todo make the description update on edit
    const [description, setDescription] = useState(event.description);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        data.description = description;

        if (data.begin_time) {
            data.begin_time = new Date(data.begin_time as string).toISOString();
        }
        if (data.end_time) {
            data.end_time = new Date(data.end_time as string).toISOString();
        }

        await patchEvent(event.name.split("/").at(-1) ?? "", data);
        onEventUpdate({ ...event, ...data });
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
            <Form onSubmit={onSubmit}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Event Details</ModalHeader>
                            <ModalBody className="flex flex-col gap-4">
                                <Input
                                    label="Title"
                                    name="title"
                                    placeholder="Enter event title"
                                    defaultValue={event.title}
                                    isRequired={true}
                                />
                                <MDEditor
                                    value={description}
                                    onChange={(value) => setDescription(value || "")}
                                    preview="live"
                                />
                                <div className="flex gap-4">
                                    <Input
                                        label="Start Time"
                                        name="begin_time"
                                        type="datetime-local"
                                        placeholder="Select start time"
                                        defaultValue={event.begin_time.slice(0, 16)}
                                        isRequired={true}
                                    />
                                    <Input
                                        label="End Time"
                                        name="end_time"
                                        type="datetime-local"
                                        placeholder="Select end time"
                                        defaultValue={event.end_time.slice(0, 16)}
                                        isRequired={true}
                                    />
                                </div>
                                <Input
                                    label="Location"
                                    name="location"
                                    isRequired={true}
                                    placeholder="Enter event location"
                                    defaultValue={event.location}
                                />
                                <Input
                                    label="Topic"
                                    name="topic"
                                    placeholder="Enter event topic"
                                    defaultValue={event.topic}
                                    isRequired={true}
                                />
                                <Input
                                    label="Link"
                                    name="link"
                                    placeholder="Enter event link"
                                    type="url"
                                    defaultValue={event.link}
                                />
                                <Input
                                    label="Picture URL"
                                    name="picture_uri"
                                    placeholder="Enter picture URL"
                                    type="url"
                                    defaultValue={event.picture_uri}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose} type="submit">
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Form>
        </Modal>
    );
}
