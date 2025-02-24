import { type Event, deleteEvent, getEvents, patchEvent, postEvent } from "@/api/missionboard";
import { toast } from "react-hot-toast";
import { confirm } from "../AreYouSurePopup";
import createCustomStore from "../CreateCustomStore";

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
    deleteEvent: (event: Event) => Promise<void>;
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
                set({ events: response.data, loading: false });
            } catch {
                toast.error("Failed to fetch events");
                set({ loading: false });
            }
        },
        selectEvent: (event: Event | null) => {
            set({ selectedEvent: event, description: event?.description ?? "", editOpen: true });
        },
        createEvent: async (event: Event) => {
            try {
                await postEvent(event);
                toast.success("Event created successfully");
                get().fetchEvents();
                set({ editOpen: false });
            } catch {
                toast.error("Failed to create event");
            }
        },
        updateEvent: async (event: Event) => {
            try {
                await patchEvent(event.name, event);
                toast.success("Event updated successfully");
                get().fetchEvents();
                set({ editOpen: false });
            } catch {
                toast.error("Failed to update event");
            }
        },
        deleteEvent: async (event: Event) => {
            const result = await confirm("Are you sure you want to delete this event?", "Delete Event");
            if (!result) return;
            try {
                await deleteEvent(event.name);
                toast.success("Event deleted successfully");
                get().fetchEvents();
            } catch {
                toast.error("Failed to delete event");
            }
        },
    }),
);
