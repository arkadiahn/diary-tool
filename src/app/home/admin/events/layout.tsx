import { AreYouSure } from "../AreYouSurePopup";
import { EventsStoreProvider } from "./_eventsStore";

export default function AdminEventsLayout({ children }: { children: React.ReactNode }) {
    return (
        <EventsStoreProvider>
            <AreYouSure />
            {children}
        </EventsStoreProvider>
    );
}
