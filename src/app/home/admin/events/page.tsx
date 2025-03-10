"use client";

import { useEffect } from "react";
import { AreYouSure } from "../AreYouSurePopup";
import CustomGrid from "../CustomGrid";
import { EditEventModal } from "./EditEventModal";
import { EventsStoreProvider, useEventsStore } from "./_eventsStore";
import { timestampToDate } from "@/api/utils";
// @todo make the edit modal open with query params

function AdminEvents() {
    const fetchEvents = useEventsStore((state) => state.fetchEvents);
    const selectEvent = useEventsStore((state) => state.selectEvent);
    const deleteEvent = useEventsStore((state) => state.deleteEvent);
    const loading = useEventsStore((state) => state.loading);
    const events = useEventsStore((state) => state.events);

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <main className="h-full w-full flex flex-col items-center justify-center p-4">
            <CustomGrid
                tableTitle="Events"
                data={events}
                loading={loading}
                onEdit={selectEvent}
                onCreate={selectEvent}
                onDelete={deleteEvent}
                columnDefs={[
                    { field: "title", minWidth: 200 },
                    { field: "topic", minWidth: 150 },
                    { field: "shortDescription", headerName: "Short Description", minWidth: 200 },
                    { field: "beginTime", headerName: "Start Time", minWidth: 190, sort: "asc", valueFormatter: (params) => timestampToDate(params.value)?.toISOString() ?? "null" },
                    { field: "endTime", headerName: "End Time", valueFormatter: (params) => timestampToDate(params.value)?.toISOString() ?? "null" },
                    { field: "location" },
                    { field: "link" },
                    { field: "pictureUri", headerName: "Picture URL" },
                ]}
            />

            <EditEventModal />
        </main>
    );
}

export default function AdminEventsWrapper() {
    return (
        <EventsStoreProvider>
            <AreYouSure />
            <AdminEvents />
        </EventsStoreProvider>
    );
}
