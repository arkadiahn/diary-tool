"use client";

import { type Event, getEvents } from "@/api/missionboard";
import CustomIcon from "@/components/CustomIcon";
import { Button, useDisclosure } from "@heroui/react";
import plus from "@iconify/icons-ic/baseline-plus";
import { AllCommunityModule, ModuleRegistry, colorSchemeDark, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { EditEventModal } from "./EditEventModal";

ModuleRegistry.registerModules([AllCommunityModule]);

const CustomActionsComponent = (props: any) => {
    return (
        <div className="flex gap-2 items-center justify-center h-full">
            <Button size="sm" onPress={() => props.onEditEvent(props.data)}>
                Edit
            </Button>
            {/* <Button size="sm" color="danger" onPress={onDeleteOpen}>Delete</Button> */}
        </div>
    );
};

// @todo make the edit modal open with query params

export default function Events() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        (async () => {
            setEvents((await getEvents()).data);
            setLoading(false);
        })();
    }, []);

    const handleEditEvent = (event: Event) => {
        setSelectedEvent(event);
        onEditOpen();
    };

    const handleEventUpdate = (updatedEvent: Event) => {
        setEvents(events.map((event) => (event.name === updatedEvent.name ? updatedEvent : event)));
    };

    const handleCreateEvent = () => {
        setSelectedEvent({
            name: "",
            title: "",
            topic: "",
            description: "",
            begin_time: "",
            end_time: "",
            location: "",
            link: "",
            picture_uri: "",
        });
        onEditOpen();
    };

    return (
        <main className="h-full w-full flex flex-col items-center justify-center p-4">
            <div className="flex justify-between items-center w-full max-w-6xl mb-4">
                <h1 className="text-2xl font-bold">Events</h1>
                <Button
                    size="sm"
                    color="primary"
                    onPress={handleCreateEvent}
                    startContent={<CustomIcon icon={plus} width={16} height={16} />}
                >
                    Create Event
                </Button>
            </div>
            <div className="h-[400px] max-w-6xl w-full">
                <AgGridReact
                    loading={loading}
                    theme={resolvedTheme === "dark" ? themeQuartz.withPart(colorSchemeDark) : themeQuartz}
                    rowData={events}
                    columnDefs={[
                        { field: "title", minWidth: 200 },
                        { field: "topic", minWidth: 150 },
                        { field: "begin_time", headerName: "Start Time" },
                        { field: "end_time", headerName: "End Time" },
                        { field: "location" },
                        { field: "link" },
                        { field: "picture_uri", headerName: "Picture URL" },
                        {
                            headerName: "Actions",
                            cellRenderer: CustomActionsComponent,
                            cellRendererParams: { onEditEvent: handleEditEvent },
                            minWidth: 100,
                        },
                    ]}
                    defaultColDef={{
                        editable: false,
                        flex: 1,
                        minWidth: 100,
                        filter: true,
                        sortable: true,
                    }}
                    pagination={true}
                    paginationPageSize={20}
                />
            </div>

            <EditEventModal
                isOpen={isEditOpen}
                onOpenChange={onEditOpenChange}
                event={selectedEvent}
                onEventUpdate={handleEventUpdate}
            />
        </main>
    );
}
