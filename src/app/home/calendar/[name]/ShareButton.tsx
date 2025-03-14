"use client";

import CustomIcon from "@/components/CustomIcon";
import type { Event } from "@arkadiahn/apis/intra/v1/event_pb";
import { Button } from "@heroui/react";
import share from "@iconify/icons-ic/outline-share";
import toast from "react-hot-toast";

interface ShareButtonProps {
    event: Event;
}
export default function ShareButton({ event }: ShareButtonProps) {
    return (
        <Button
            color="secondary"
            endContent={<CustomIcon icon={share} width={16} height={16} />}
            onPress={async () => {
                const shareData = {
                    title: event.title,
                    text: event.description,
                    url: window.location.href,
                };

                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else if (navigator.clipboard) {
                        await navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                    } else {
                        const textarea = document.createElement("textarea");
                        textarea.value = window.location.href;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                        toast.success("Link copied to clipboard!");
                    }
                } catch {}
            }}
        >
            Share Event
        </Button>
    );
}
