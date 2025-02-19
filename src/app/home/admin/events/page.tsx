"use client";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useEffect } from "react";
import CustomGrid from "../CustomGrid";
import { EditEventModal } from "./EditEventModal";
import { EventsStoreProvider, useEventsStore } from "./_eventsStore";
// @todo make the edit modal open with query params

ModuleRegistry.registerModules([AllCommunityModule]);


function AdminEvents() {
    const fetchEvents = useEventsStore((state) => state.fetchEvents);
	const selectEvent = useEventsStore((state) => state.selectEvent);
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
				onEdit={(event) => selectEvent(event)}
				onCreate={() => selectEvent(null)}
				columnDefs={[
					{ field: "title", minWidth: 200 },
					{ field: "topic", minWidth: 150 },
					{ field: "begin_time", headerName: "Start Time", minWidth: 190, sort: "asc" },
					{ field: "end_time", headerName: "End Time" },
					{ field: "location" },
					{ field: "link" },
					{ field: "picture_uri", headerName: "Picture URL" }
				]}
			/>

            <EditEventModal />
		</main>
    );
}

export default function AdminEventsWrapper() {
	return (
		<EventsStoreProvider>
			<AdminEvents />
		</EventsStoreProvider>
	)
}
