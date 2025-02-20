"use client";

import type { Mission, MissionAccount } from "@/api/missionboard";
import { useSession } from "@/auth/client";
import CustomIcon from "@/components/CustomIcon";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Chip, Divider, Link } from "@heroui/react";
import MainPageLayout from "../../src/components/MainPageLayout";
import JoinMissionButton from "./JoinMissionButton";

/* ---------------------------------- Icons --------------------------------- */
import icCalendarEventFill from "@iconify/icons-ri/calendar-event-fill";
import icGithubFill from "@iconify/icons-ri/github-fill";
import HeartIcon from "@iconify/icons-solar/heart-bold";
import { useMemo } from "react";

interface MissionDetailsProps {
    mission: Mission;
    timelineComponent?: React.ReactNode;
    accounts: MissionAccount[];
}
export default function MissionDetails({ mission, timelineComponent, accounts }: MissionDetailsProps) {
    const { session } = useSession();

    const isLeader = useMemo(() => {
        return `accounts/${session?.user.id}` === mission.leader;
    }, [session, mission.leader]);

    return (
        <MainPageLayout>
            <div className="min-h-full w-full flex flex-col gap-6">
                <Breadcrumbs size="lg" className="self-start font-medium">
                    <BreadcrumbItem href="/missions">Missions</BreadcrumbItem>
                    <BreadcrumbItem>{mission.title}</BreadcrumbItem>
                </Breadcrumbs>

                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center gap-2">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold">{mission.title}</h1>
                            <p className="text-default-500">Led by {mission.leader}</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <CustomIcon icon={HeartIcon} className="w-5 h-5 text-danger" />
                                    <span>{mission.like_count} likes</span>
                                </div>
                                <Divider orientation="vertical" className="h-5" />
                                <Chip
                                    color={
                                        mission.mission_state === "active"
                                            ? "primary"
                                            : mission.mission_state === "completed"
                                              ? "success"
                                              : mission.mission_state === "failed"
                                                ? "danger"
                                                : "default"
                                    }
                                    variant="dot"
                                >
                                    {mission.mission_state}
                                </Chip>
                            </div>
                        </div>
                        <JoinMissionButton mission={mission} />
                    </div>
                    <Divider />
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex justify-between gap-3">
                        <div className="flex flex-col gap-3">
                            <section>
                                <h2 className="text-xl font-semibold mb-1">Description</h2>
                                <p className="text-default-600 leading-relaxed">{mission.description}</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-1">Goals</h2>
                                <p className="text-default-600 leading-relaxed">{mission.description_goal}</p>
                            </section>

                            <section className="pt-4">
                                <h2 className="text-xl font-semibold mb-1">Required Skills</h2>
                                <p className="text-default-600 leading-relaxed">{mission.description_skills}</p>
                            </section>
                        </div>

                        <section className="w-64">
                            <h2 className="text-xl font-semibold mb-1">Accounts</h2>
                            <div className="flex flex-col gap-3">
                                {accounts.map((account) => (
                                    <div className="flex items-center gap-2" key={account.account.name}>
                                        <span>{account.account.nick_name}</span>
                                        <span>{account.account.email}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="pt-4">
                        <h2 className="text-xl font-semibold mb-1">Timeline</h2>
                        {timelineComponent}
                    </section>
                </div>

                {isLeader && (
                    <Button color="primary" className="max-w-xs mt-auto">
                        Edit Mission
                    </Button>
                )}
            </div>
        </MainPageLayout>
    );
}
