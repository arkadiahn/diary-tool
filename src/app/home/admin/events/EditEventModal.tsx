import webClient from "@/api";
import { timestampToDate } from "@/api/utils";

import CustomIcon from "@/components/CustomIcon";
import { Autocomplete, AutocompleteItem, DateRangePicker, Input } from "@heroui/react";
import icImage from "@iconify/icons-ic/round-image";
import { now, parseAbsolute } from "@internationalized/date";
import MDEditor, { getCommands, commands } from "@uiw/react-md-editor";
import { toast } from "react-hot-toast";
import CustomEditModal from "../CustomEditModal";
import ImageUpload from "./ImageUpload";
import { useEventsStore } from "./_eventsStore";

export function EditEventModal() {
    const setDescription = useEventsStore((state) => state.setDescription);
    const selectedEvent = useEventsStore((state) => state.selectedEvent);
    const updateEvent = useEventsStore((state) => state.updateEvent);
    const createEvent = useEventsStore((state) => state.createEvent);
    const description = useEventsStore((state) => state.description);
    const toggleEdit = useEventsStore((state) => state.toggleEdit);
    const editOpen = useEventsStore((state) => state.editOpen);

    return (
        <CustomEditModal
            isOpen={editOpen}
            onOpenChange={toggleEdit}
            title="Event Details"
            data={selectedEvent}
            onUpdate={updateEvent}
            onCreate={createEvent}
        >
            <input name="name" value={selectedEvent?.name ?? ""} readOnly={true} className="hidden" />
            <Input
                size="sm"
                label="Title"
                name="title"
                placeholder="Enter event title"
                defaultValue={selectedEvent?.title}
                isRequired={true}
            />
            <Input
                label="Short Description"
                name="shortDescription"
                defaultValue={selectedEvent?.shortDescription ?? ""}
                placeholder="Enter short description"
                isRequired={true}
                size="sm"
            />
            <ImageUpload name="pictureUri" label="Event Header Picture" />
            <div className="col-span-1 space-y-2">
                <p className="text-small text-gray-800 dark:text-gray-200 pl-0.5">
                    Description<span className="text-red-500">*</span>
                </p>
                <MDEditor
                    textareaProps={{
                        name: "description",
                        required: true,
                    }}
                    value={description}
                    onChange={(value) => setDescription(value ?? "")}
                    commands={[
                        ...getCommands(),
                        commands.divider,
                        {
                            name: "Upload image",
                            keyCommand: "upload-image",
                            shortcuts: "ctrl+shift+i",
                            icon: <CustomIcon icon={icImage} className="w-3 h-3" />,
                            buttonProps: {
                                "aria-label": "Upload image (ctrl + shift + i)",
                                title: "Upload image (ctrl + shift + i)",
                            },
                            async execute() {
                                try {
                                    const input = document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*";
                                    const filePromise = new Promise<File | null>((resolve) => {
                                        input.onchange = () => resolve(input.files ? input.files[0] : null);
                                    });
                                    input.click();
                                    const file = await filePromise;
                                    if (!file) {
                                        throw new Error("No file selected");
                                    }
                                    const { fileUri } = await webClient.uploadFile({
                                        data: new Uint8Array(await file.arrayBuffer()),
                                        filename: file.name,
                                        bucket: "public",
                                    });
                                    setDescription(`${description}\n![${file.name}](${fileUri})`);
                                } catch (error) {
                                    toast.error("Error uploading image");
                                    console.error(error);
                                }
                            },
                        },
                    ]}
                    preview="live"
                    visibleDragbar={false}
                    maxHeight={250}
                    height={250}
                />
            </div>
            <DateRangePicker
                size="sm"
                isRequired={true}
                label="Event Start and End Date"
                startName="beginTime"
                endName="endTime"
                aria-label="Event Start and End Date"
                visibleMonths={2}
                placeholderValue={now("Europe/Berlin")}
                defaultValue={
                    selectedEvent?.beginTime && selectedEvent?.endTime
                        ? {
                              start: parseAbsolute(
                                  timestampToDate(selectedEvent.beginTime)!.toISOString(),
                                  "Europe/Berlin",
                              ),
                              end: parseAbsolute(
                                  timestampToDate(selectedEvent.endTime)!.toISOString(),
                                  "Europe/Berlin",
                              ),
                          }
                        : undefined
                }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Autocomplete
                    size="sm"
                    label="Location"
                    name="location"
                    placeholder="Enter event location"
                    defaultInputValue={selectedEvent?.location}
                    allowsCustomValue={true}
                    isRequired={true}
                >
                    <AutocompleteItem>OpenSpace</AutocompleteItem>
                    <AutocompleteItem>OpenSpace - Stage</AutocompleteItem>
                </Autocomplete>
                <Autocomplete
                    size="sm"
                    label="Event Topic"
                    name="topic"
                    placeholder="Enter event topic"
                    defaultInputValue={selectedEvent?.topic}
                    allowsCustomValue={true}
                    isRequired={true}
                >
                    <AutocompleteItem>Play</AutocompleteItem>
                    <AutocompleteItem>Code</AutocompleteItem>
                    <AutocompleteItem>Change</AutocompleteItem>
                </Autocomplete>
            </div>
            <Input
                size="sm"
                label="Link"
                name="link"
                placeholder="Enter event link"
                type="url"
                defaultValue={selectedEvent?.link}
            />
        </CustomEditModal>
    );
}
