import { timestampToDate } from "@/api/utils";
import webClient from "@/api";

import { DatePicker, Input, Textarea } from "@heroui/react";
import { now, parseAbsolute } from "@internationalized/date";
import MDEditor from "@uiw/react-md-editor";
import CustomEditModal from "../CustomEditModal";
import { useEventsStore } from "./_eventsStore";
import CustomIcon from "@/components/CustomIcon";
import icImage from "@iconify/icons-ic/round-image";
import { toast } from "react-hot-toast";

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
            <div className="col-span-1">
                <MDEditor
                    textareaProps={{
                        name: "description",
                    }}
                    value={description}
                    onChange={(value) => setDescription(value ?? "")}
					extraCommands={[
						{
							name: "Upload Image",
							keyCommand: "upload-image",
							icon: <CustomIcon icon={icImage} className="w-4 h-4" />,
							buttonProps: { 'aria-label': 'Upload Image' },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                    size="sm"
                    label="Start Time"
                    name="beginTime"
                    defaultValue={
                        selectedEvent?.beginTime ? parseAbsolute(timestampToDate(selectedEvent.beginTime)!.toISOString(), "Europe/Berlin") : null
                    }
                    placeholderValue={now("Europe/Berlin")}
                    isRequired={true}
                />
                <DatePicker
                    size="sm"
                    label="End Time"
                    name="endTime"
                    defaultValue={
                        selectedEvent?.endTime ? parseAbsolute(timestampToDate(selectedEvent.endTime)!.toISOString(), "Europe/Berlin") : null
                    }
                    placeholderValue={now("Europe/Berlin")}
                    isRequired={true}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    size="sm"
                    label="Location"
                    name="location"
                    isRequired={true}
                    placeholder="Enter event location"
                    defaultValue={selectedEvent?.location}
                />
                <Input
                    size="sm"
                    label="Topic"
                    name="topic"
                    placeholder="Enter event topic"
                    defaultValue={selectedEvent?.topic}
                    isRequired={true}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    size="sm"
                    label="Link"
                    name="link"
                    placeholder="Enter event link"
                    type="url"
                    defaultValue={selectedEvent?.link}
                />
                <Input
                    size="sm"
                    label="Picture URL"
                    name="pictureUri"
                    placeholder="Enter picture URL"
                    type="url"
                    defaultValue={selectedEvent?.pictureUri}
                />
            </div>
            {/* // @todo add image upload */}
        </CustomEditModal>
    );
}
