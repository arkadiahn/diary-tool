"use client";

import { timestampToDate } from "@/api/utils";
import { Checkbox } from "@heroui/react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import CustomGrid from "../CustomGrid";
import { EditEventModal } from "./EditEventModal";
import { useEventsStore } from "./_eventsStore";

// @todo make the edit modal open with query params

export default function AdminEvents() {
    const [onlyUpcoming, setOnlyUpcoming] = useQueryState("onlyUpcoming", parseAsBoolean.withDefault(true));
    const [fetchEvents, selectEvent, deleteEvent, loading, events] = useEventsStore(
        useShallow((state) => [state.fetchEvents, state.selectEvent, state.deleteEvent, state.loading, state.events]),
    );

    useEffect(() => {
        fetchEvents(onlyUpcoming);
    }, [onlyUpcoming]);

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
                    { field: "title", minWidth: 200, pinned: "left" },
                    { field: "topic", minWidth: 150 },
                    { field: "shortDescription", headerName: "Short Description", minWidth: 200 },
                    {
                        field: "beginTime",
                        headerName: "Start Time",
                        minWidth: 190,
                        sort: "asc",
                        valueFormatter: (params) => timestampToDate(params.value)?.toISOString() ?? "null",
                    },
                    {
                        field: "endTime",
                        headerName: "End Time",
                        valueFormatter: (params) => timestampToDate(params.value)?.toISOString() ?? "null",
                    },
                    { field: "location" },
                    { field: "link" },
                    { field: "pictureUri", headerName: "Picture URL" },
                ]}
                extraButtons={
                    <Checkbox size="sm" isSelected={onlyUpcoming} onValueChange={setOnlyUpcoming}>
                        Only upcoming events
                    </Checkbox>
                }
            />

            <EditEventModal />
        </main>
    );
}
