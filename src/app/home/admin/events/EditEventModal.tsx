import type { Event } from "@/api/missionboard";
import { DatePicker, Input } from "@heroui/react";
import { now, parseAbsolute } from "@internationalized/date";
import MDEditor from "@uiw/react-md-editor";
import CustomEditModal from "../CustomEditModal";
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
            onUpdate={async (data: Event) => await updateEvent(data)}
            onCreate={async (data: Event) => await createEvent(data)}
        >
            <input name="name" value={selectedEvent?.name ?? ""} readOnly={true} className="hidden" />
            <input name="description" value={description} readOnly={true} className="hidden" />
            <Input
                size="sm"
                label="Title"
                name="title"
                placeholder="Enter event title"
                defaultValue={selectedEvent?.title}
                isRequired={true}
            />
            <div className="col-span-1">
                <MDEditor
                    value={description}
                    onChange={(value) => setDescription(value ?? "")}
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
                    name="begin_time"
                    defaultValue={
                        selectedEvent?.begin_time ? parseAbsolute(selectedEvent.begin_time, "Europe/Berlin") : null
                    }
                    placeholderValue={now("Europe/Berlin")}
                    isRequired={true}
                />
                <DatePicker
                    size="sm"
                    label="End Time"
                    name="end_time"
                    defaultValue={
                        selectedEvent?.end_time ? parseAbsolute(selectedEvent.end_time, "Europe/Berlin") : null
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
                    name="picture_uri"
                    placeholder="Enter picture URL"
                    type="url"
                    defaultValue={selectedEvent?.picture_uri}
                />
            </div>
        </CustomEditModal>
    );
}
