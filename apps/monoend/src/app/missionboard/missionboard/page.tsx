import MissionView from "../src/components/missionView";

export default function Home() {
    return (
        <>
            <header>
                <h1 className="text-7xl font-bold text-center">
                    Mission<span>Board</span>
                </h1>
            </header>
            <main className="flex-1 flex flex-col overflow-hidden">
                <MissionView />
            </main>
        </>
    );
}
