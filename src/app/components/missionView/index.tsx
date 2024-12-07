"use client";

import { Icon } from "@iconify/react";
import { CheckboxGroup, Input, ScrollShadow } from "@nextui-org/react";
import MissionCard from "./missionCard";
import TagGroupItem from "./tagGroupItem";

export default function MissionView() {
    return (
        <>
            <div className="w-full flex justify-between items-center p-6">
                <div className="flex gap-2 items-center">
                    <h3 className="text-medium font-medium leading-8 text-default-600">
                        Projekt Status
                    </h3>
                    <CheckboxGroup
                        aria-label="Select amenities"
                        className="gap-1"
                        orientation="horizontal"
                    >
                        <TagGroupItem value="active" isSelected>
                            Aktiv
                        </TagGroupItem>
                        <TagGroupItem value="completed">
                            Abgeschlossen
                        </TagGroupItem>
                        <TagGroupItem value="abandoned">
                            Abgebrochen
                        </TagGroupItem>
                    </CheckboxGroup>
                </div>
                <Input
                    placeholder="Search..."
                    className="w-full self-center sm:max-w-xs"
                    isClearable
                    startContent={
                        <Icon
                            icon="fluent:search-24-filled"
                            className="w-6 h-6 pointer-events-none"
                        />
                    }
                />
            </div>
            <ScrollShadow className="scrollbar scrollbar-thumb-default-300 scrollbar-track-transparent">
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,300px)] justify-center p-6">
                    {Array.from({ length: 18 }).map((_, idx) => (
                        <MissionCard key={idx} />
                    ))}
                </div>
            </ScrollShadow>
        </>
    );
}
