import { getEvents, patchEvent, postEvent, type Event } from "@/api/missionboard";
import createCustomStore from "../CreateCustomStore";
import { toast } from "react-hot-toast";

type EventsStore = {
	events: Event[];
	selectedEvent: Event | null;
	loading: boolean;
	editOpen: boolean;
	description: string;
	setDescription: (description: string) => void;
	toggleEdit: () => void;
	fetchEvents: () => Promise<void>;
	selectEvent: (event: Event | null) => void;
	createEvent: (event: Event) => Promise<void>;
	updateEvent: (event: Event) => Promise<void>;

};
export const { StoreProvider: EventsStoreProvider, useStore: useEventsStore } = createCustomStore<EventsStore>(
	(set, get) => ({
		events: [],
		selectedEvent: null,
		loading: true,
		editOpen: false,
		description: "",
		setDescription: (description: string) => set({ description }),
		toggleEdit: () => set((state) => ({ editOpen: !state.editOpen })),
		fetchEvents: async () => {
			set({ loading: true, events: [] });
			try {
				const response = await getEvents();
				if (response.status >= 300 || response.status < 200) {
					throw new Error("Failed to fetch events");
				}
				set({ events: response.data, loading: false });
			} catch (error) {
				toast.error("Failed to fetch events");
				set({ loading: false });
			}
		},
		selectEvent: (event: Event | null) => {
			set({ selectedEvent: event, description: event?.description ?? "", editOpen: true });
		},
		createEvent: async (event: Event) => {
			try {
				const response = await postEvent(event);
				if (response.status >= 300 || response.status < 200) {
					throw new Error("Failed to create event");
				}
				toast.success("Event created successfully");
				get().fetchEvents();
				set({ editOpen: false });
			} catch (error) {
				toast.error("Failed to create event");
			}
		},
		updateEvent: async (event: Event) => {
			try {
				const response = await patchEvent(event.name.split("/").at(-1) ?? "", event);
				if (response.status >= 300 || response.status < 200) {
					throw new Error("Failed to update event");
				}
				toast.success("Event updated successfully");
				get().fetchEvents();
				set({ editOpen: false });
			} catch (error) {
				toast.error("Failed to update event");
			}
		},
	})
);
