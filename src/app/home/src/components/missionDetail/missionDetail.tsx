"use client";

import CustomIcon from "@/components/CustomIcon";
import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";
import { BreadcrumbItem, Breadcrumbs, Button, Tooltip } from "@heroui/react";
import { Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import MissionState from "../../../missions/MissionState";

import { timestampToDate } from "@/api/utils";
import icCalendarEventFill from "@iconify/icons-ri/calendar-event-fill";
import icGithubFill from "@iconify/icons-ri/github-fill";
import icTimeFill from "@iconify/icons-ri/time-fill";

interface MissionDetailViewProps {
    data: Mission;
    timelineComponent?: React.ReactNode;
}
export default function MissionDetailView({ data, timelineComponent }: MissionDetailViewProps) {
    const router = useRouter();

    return (
        <>
            <div className="w-full p-6">
                <Breadcrumbs
                    size="lg"
                    className="mb-5"
                    itemClasses={{
                        item: "text-default-600",
                        separator: "text-default-400",
                    }}
                >
                    <BreadcrumbItem href="/missions">MissionBoard</BreadcrumbItem>
                    <BreadcrumbItem>{data.title}</BreadcrumbItem>
                </Breadcrumbs>

                <div className="bg-content1 rounded-large p-6 shadow-small">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-2xl font-medium">{data.title}</h1>
                            <MissionState state={data.state} />
                            <button
                                type="button"
                                onClick={() => router.push(`/${data.name}/edit`)}
                                className="text-primary hover:text-primary-600 text-sm font-medium transition-colors"
                            >
                                Edit Project
                            </button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-2">
                                    <Tooltip content="Project Start Date">
                                        <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary rounded-full px-3 py-1 cursor-help">
                                            <CustomIcon icon={icCalendarEventFill} width={16} />
                                            <span className="text-sm font-medium">
                                                {timestampToDate(data.kickoffTime)?.toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </Tooltip>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Tooltip content="Project End Date">
                                        <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary rounded-full px-3 py-1 cursor-help">
                                            <CustomIcon icon={icTimeFill} width={16} />
                                            <span className="text-sm font-medium">
                                                {(timestampToDate(data.endTime) ?? new Date()).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    },
                                                )}
                                            </span>
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                            <Button as="a" href={data.githubLink} target="_blank" variant="light" onPress={() => {}}>
                                GitHub
                                <CustomIcon width={28} icon={icGithubFill} />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="space-y-2">
                                <h3 className="text-md font-medium">Description</h3>
                                <p>{data.description}</p>
                            </div>
                            <div className="mt-4 space-y-2">
                                <h3 className="text-md font-medium">Goal</h3>
                                <p>{data.descriptionGoal}</p>
                            </div>
                        </div>
                        <div className="space-y-4 flex flex-col items-end text-right">
                            <div className="space-y-2">
                                <h3 className="text-md font-medium">Needed Skills</h3>
                                <div className="flex flex-wrap gap-1 justify-end">
                                    {data.descriptionSkills.split(", ").map((skill) => (
                                        <Chip key={skill} className="text-xs" color="primary">
                                            {skill}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full space-y-2 mt-4">
                        <h3 className="text-md font-medium">Timeline</h3>
                        {timelineComponent}
                    </div>
                </div>
            </div>
        </>
    );
}
