"use client";

import type { Account } from "@arkadiahn/apis/intra/v1/account_pb";
import { type Mission, Mission_State } from "@arkadiahn/apis/intra/v1/mission_pb";

import { useSession } from "@/auth/client";
import CustomIcon from "@/components/CustomIcon";
import {
    Avatar,
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Link,
} from "@heroui/react";
import MainPageLayout from "../../src/components/MainPageLayout";
import JoinMissionButton from "./JoinMissionButton";

/* ---------------------------------- Icons --------------------------------- */
import icCalendarEventFill from "@iconify/icons-ri/calendar-event-fill";
import icGithubFill from "@iconify/icons-ri/github-fill";
import HeartIcon from "@iconify/icons-solar/heart-bold";
import { useEffect, useMemo, useState } from "react";
import webClient from "@/api";
import type { MissionAccount } from "@arkadiahn/apis/intra/v1/mission_account_pb";

interface MissionDetailsProps {
    mission: Mission;
    timelineComponent?: React.ReactNode;
    accounts: Account[];
	missionAccounts: MissionAccount[];
    leaderAccount: Account;
}
export default function MissionDetails({ mission, timelineComponent, accounts, leaderAccount, missionAccounts }: MissionDetailsProps) {
    const { session } = useSession();

    const isLeader = useMemo(() => {
        return `accounts/${session?.user.id}` === mission.leader;
    }, [session, mission.leader]);

	const onApprove = async (account: Account) => {
		await webClient.updateMissionAccount({
			missionAccount: {
				name: `${mission.name}/${account.name}`,
				approved: true
			},
			updateMask: {
				paths: ["approved"],
			},
		});
	}

	const onReject = async (account: Account) => {
		await webClient.deleteMissionAccount({
			name: `${mission.name}/${account.name}`,
		});
	}

    return (
        <MainPageLayout>
            <div className="min-h-full w-full flex flex-col gap-6">
                <Breadcrumbs size="lg" className="self-start font-medium">
                    <BreadcrumbItem href="/">Missions</BreadcrumbItem>
                    <BreadcrumbItem>{mission.title}</BreadcrumbItem>
                </Breadcrumbs>

                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center gap-2">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold">{mission.title}</h1>
                            <p className="text-default-500">Led by: {leaderAccount.nick}</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <CustomIcon icon={HeartIcon} className="w-5 h-5 text-danger" />
                                    <span>{mission.likeCount} likes</span>
                                </div>
                                <Divider orientation="vertical" className="h-5" />
                                <Chip
                                    color={
                                        {
                                            [Mission_State.COMPLETED]: "success",
                                            [Mission_State.ACTIVE]: "primary",
                                            [Mission_State.FAILED]: "danger",
                                            [Mission_State.PENDING]: "warning",
                                            [Mission_State.UNSPECIFIED]: "warning",
                                        }[mission.state] as
                                            | "success"
                                            | "primary"
                                            | "danger"
                                            | "warning"
                                            | "default"
                                            | "secondary"
                                    }
                                    variant="dot"
                                >
                                    {
                                        {
                                            0: "Unspecified",
                                            1: "Pending",
                                            2: "Active",
                                            3: "Completed",
                                            4: "Failed",
                                        }[mission.state]
                                    }
                                </Chip>
                            </div>
                        </div>
                        {!isLeader && <JoinMissionButton mission={mission} />}
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
                                <p className="text-default-600 leading-relaxed">{mission.descriptionGoal}</p>
                            </section>

                            <section className="pt-4">
                                <h2 className="text-xl font-semibold mb-1">Required Skills</h2>
                                <p className="text-default-600 leading-relaxed">{mission.descriptionSkills}</p>
                            </section>
                        </div>

                        <section className="w-80">
                            <Card className="h-full min-h-[300px]">
                                <CardBody>
                                    <h2 className="text-xl font-semibold">Team Members</h2>
                                    <Divider className="my-3" />
                                    <div className="flex flex-col gap-4">
                                        {accounts.map((account) => (
                                            <div className="flex items-center gap-3" key={account.nick}>
                                                <Avatar
                                                    name={account.nick}
                                                    className="bg-primary/10 text-primary"
                                                    size="sm"
                                                />
                                                <div className="flex flex-col subpixel-antialiased">
                                                    <span className="text-small font-medium">{account.nick}</span>
                                                    <span className="text-xs text-default-500">{account.email}</span>
                                                </div>
												{(!missionAccounts.find((missionAccount) => missionAccount.account === account.name)?.approved && isLeader) && (<div className="ml-auto flex items-center gap-1">
													<Button size="sm" color="success" onPress={() => onApprove(account)}>
														Appr.
													</Button>
													<Button size="sm" color="danger" onPress={() => onReject(account)}>
														Reject
														</Button>
													</div>
												)}
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </section>
                    </div>

                    <section className="pt-4">
                        <Divider className="my-3" />
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
