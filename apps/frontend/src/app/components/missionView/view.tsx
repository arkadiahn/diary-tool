"use client";

import { CheckboxGroup, Input, ScrollShadow } from "@nextui-org/react";
import { ProjectSummaryArray } from "@/api/missionboard";
import TagGroupItem from "./tagGroupItem";
import MissionCard from "./missionCard";
import { Icon } from "@iconify/react";

export default function MissionView({ projects }: { projects: ProjectSummaryArray }) {
    return (
        <>
            <div className="w-full gap-2 flex justify-between items-center p-6 flex-col lg:flex-row">
                <div className="flex gap-2 items-center order-last lg:order-first">
                    <h3 className="text-medium font-medium leading-8 text-default-600 hidden lg:block">
                        Project State
                    </h3>
                    <CheckboxGroup
                        aria-label="Select amenities"
                        className="gap-1"
                        orientation="horizontal"
						value={["active"]}
                    >
                        <TagGroupItem value="active">
                            Active
                        </TagGroupItem>
                        <TagGroupItem value="completed">
                            Completed
                        </TagGroupItem>
                        <TagGroupItem value="abandoned">
                            Abandoned
                        </TagGroupItem>
                    </CheckboxGroup>
                </div>
                <Input
                    placeholder="Search..."
                    className="w-full self-center lg:max-w-xs"
                    isClearable
                    startContent={
                        <Icon
                            icon="fluent:search-24-filled"
                            className="w-6 h-6 pointer-events-none"
                        />
                    }
                />
            </div>
            {/* @todo: Fix scrollbar overlayed by shadow */}
            <ScrollShadow className="scrollbar scrollbar-thumb-default-300 scrollbar-track-transparent">
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,300px)] justify-center p-6">
					{projects.map((project) => (
						<MissionCard
							key={project.name}
							data={project}
						/>
					))}
                </div>
            </ScrollShadow>
        </>
    );
}
