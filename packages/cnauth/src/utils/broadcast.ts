let broadcastChannel: BroadcastChannel | null = null;

function getNewBroadcastChannel() {
    return new BroadcastChannel("cnauth");
}

export function broadcast() {
    if (typeof BroadcastChannel === "undefined") {
        return {
            postMessage: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
        };
    }

    if (broadcastChannel === null) {
        broadcastChannel = getNewBroadcastChannel();
    }

    return broadcastChannel;
}
