"use client";

import webClient from "@/api";
import type { Diary } from "@arkadiahn/apis/intra/v1/diary_pb";

import type { Session } from "@/auth/models";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import { Button } from "@heroui/react";
import {
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import type { ApexOptions } from "apexcharts";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginButton from "../../layout/navbar/loginButton";
import example_entries from "./example_entries";

interface DiaryOverviewProps {
    session: Session | null;
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function getTargetSunday(): Timestamp {
    const now = new Date();
    const isBeforeMondayTenAM = now.getUTCDay() === 1 && now.getUTCHours() < 10;

    const targetDate = new Date();
    targetDate.setUTCDate(now.getUTCDate() - now.getUTCDay());

    if (!isBeforeMondayTenAM) {
        targetDate.setUTCDate(targetDate.getUTCDate() + 7);
    }

    targetDate.setUTCHours(0, 0, 0, 0);

    return {
        seconds: BigInt(Math.floor(targetDate.getTime() / 1000)),
        nanos: 0,
        $typeName: "google.protobuf.Timestamp" as const,
    };
}

export default function DiaryOverview({ session }: DiaryOverviewProps) {
    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [loading, setLoading] = useState(true);
    const [isExample, setIsExample] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasEntryThisWeek, setHasEntryThisWeek] = useState(false);
    const router = useRouter();
    const _isAdmin = session?.user?.scopes.includes("diary.admin");

    const convertProtoTimestampToDate = (timestamp: { seconds: bigint | number; nanos: number }) => {
        const seconds = typeof timestamp.seconds === "bigint" ? Number(timestamp.seconds) : timestamp.seconds;
        const milliseconds = seconds * 1000 + Math.floor(timestamp.nanos / 1_000_000); // Convert nanos to milliseconds
        return new Date(milliseconds);
    };

    useEffect(() => {
        const fetchDiaries = async () => {
            let diaries: Diary[] = [];
            if (!session) {
                setIsExample(true);
            }
            try {
                diaries = (
                    await webClient.listDiaries({
                        parent: `accounts/${session?.user.id}`,
                    })
                ).diaries;
                if (diaries.length === 0) {
                    setIsExample(true);
                    setHasEntryThisWeek(false);
                    return;
                }
                const lastEntry = diaries.at(-1)!;
                if (lastEntry.entryTime?.seconds !== getTargetSunday().seconds) {
                    setHasEntryThisWeek(false);
                    return;
                }
                setHasEntryThisWeek(true);
            } catch {
                setIsExample(true);
                diaries = example_entries;
                setError("Failed to fetch diaries");
            } finally {
                if (isExample) {
                    diaries = example_entries;
                }
                const sortedDiaries = diaries.sort(
                    (a, b) =>
                        convertProtoTimestampToDate(a.entryTime!).getTime() -
                        convertProtoTimestampToDate(b.entryTime!).getTime(),
                );
                setDiaries(sortedDiaries);
                setLoading(false);
                return;
            }
        };

        fetchDiaries();
    }, [session]);

    const handleGoalChange = async (diaryName: string, goalIndex: number, checked: boolean) => {
        const updatedDiaries = diaries.map(async (diary) => {
            if (diary.name === diaryName) {
                const updatedDiary = {
                    ...diary,
                    goals: diary.goals.map((goal, idx) => (idx === goalIndex ? { ...goal, completed: checked } : goal)),
                };
                await webClient.updateDiary({
                    diary: updatedDiary,
                });
                return updatedDiary;
            }
            return diary;
        });
        setDiaries(await Promise.all(updatedDiaries));
    };

    // Helper function to find project change points
    const getProjectChangePoints = () => {
        const points: number[] = [];
        diaries.forEach((diary, index) => {
            if (index === 0) {
                points.push(index);
            } else if (diary.project !== diaries[index - 1].project) {
                points.push(index);
            }
        });
        return points;
    };

    const baseChartOptions: ApexOptions = {
        chart: {
            type: "line",
            toolbar: {
                show: false,
            },
            animations: {
                enabled: false,
            },
            zoom: {
                enabled: false,
            },
        },
        stroke: {
            curve: "straight",
            width: 5,
        },
        xaxis: {
            type: "datetime",
            categories: diaries.map((diary) => convertProtoTimestampToDate(diary.entryTime!).getTime()),
            labels: {
                style: {
                    colors: "#666",
                },
            },
        },
        markers: {
            size: 6,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 8,
            },
        },
        annotations: {
            xaxis: getProjectChangePoints().map((index) => ({
                x: convertProtoTimestampToDate(diaries[index].entryTime!).getTime(),
                strokeDashArray: 2,
                borderColor: "#FF4E4E",
                label: {
                    borderColor: "#FF4E4E",
                    style: {
                        color: "#fff",
                        background: "#FF4E4E",
                    },
                    text: `${diaries[index].project}`,
                    position: "top",
                    orientation: "horizontal",
                    offsetY: -15,
                },
            })),
        },
        tooltip: {
            theme: "dark",
            shared: true,
            intersect: false,
            style: {
                fontSize: "12px",
            },
            marker: {
                show: true,
            },
        },
    };

    const motivationChartOptions: ApexOptions = {
        ...baseChartOptions,
        colors: ["#006FEE"],
        yaxis: {
            min: 0,
            max: 10,
            tickAmount: 5,
            title: {
                text: "Motivation",
            },
        },
        tooltip: {
            ...baseChartOptions.tooltip,
            y: {
                formatter: (value: number) => `${value}/10`,
            },
        },
    };

    const weeksChartOptions: ApexOptions = {
        ...baseChartOptions,
        colors: ["#17C964"],
        yaxis: {
            min: 0,
            title: {
                text: "Weeks till completion",
            },
        },
        tooltip: {
            ...baseChartOptions.tooltip,
            y: {
                formatter: (value: number) => `${value} weeks`,
            },
        },
    };

    const motivationSeries = [
        {
            name: "Motivation",
            data: diaries.map((diary) => diary.motivation),
        },
    ];

    const weeksSeries = [
        {
            name: "Weeks till completion",
            data: diaries.map((diary) => diary.completionWeeks),
        },
    ];

    const completionSeries = [
        {
            name: "Tasks Completed",
            data: diaries.map((diary) => {
                if (diary.goals.length === 0) {
                    return null;
                }
                const completedTasks = diary.goals.filter((goal) => goal.completed).length;
                return Math.round((completedTasks / diary.goals.length) * 100);
            }),
        },
    ];

    const completionChartOptions: ApexOptions = {
        ...baseChartOptions,
        colors: ["#F5A524"],
        yaxis: {
            min: 0,
            max: 100,
            title: {
                text: "Tasks Completed (%)",
            },
            labels: {
                formatter: (value: number) => `${value}%`,
            },
        },
        tooltip: {
            ...baseChartOptions.tooltip,
            y: {
                formatter: (value: number) => `${value}%`,
            },
        },
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="w-full px-4 sm:px-6 lg:px-10">
            {error && <div>Error: {error}</div>}
            {isExample && (
                <div className="mb-6">
                    {session && (
                        <Card
                            isPressable={true}
                            onPress={() => router.push("/new")}
                            className="bg-success-50 dark:bg-success-100 w-full"
                        >
                            <CardBody className="py-2">
                                <span className="text-success text-lg font-semibold">+ Create Your First Entry</span>
                            </CardBody>
                        </Card>
                    )}
                    <div className="bg-warning-50 dark:bg-warning-100 p-4 rounded-lg mb-4">
                        <p className="text-warning text-lg font-medium mb-2">Example Data log in to see your own</p>
                        <p className="text-warning-700 dark:text-warning-200 mt-2">
                            The data below shows example entries to help you understand how your diary will look.
                        </p>
                    </div>
                </div>
            )}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 ${isExample ? "opacity-60" : ""}`}>
                <Card className="w-full col-span-1 lg:col-span-3 xl:col-span-1">
                    <CardHeader>
                        <h3 className="text-xl font-medium">Motivation Over Time</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="w-full h-[400px] overflow-hidden">
                            <Chart
                                options={motivationChartOptions}
                                series={motivationSeries}
                                type="line"
                                height="100%"
                            />
                        </div>
                    </CardBody>
                </Card>

                <Card className="w-full col-span-1 lg:col-span-3 xl:col-span-1">
                    <CardHeader>
                        <h3 className="text-xl font-medium">Weeks Till Completion</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="w-full h-[400px] overflow-hidden">
                            <Chart options={weeksChartOptions} series={weeksSeries} type="line" height="100%" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="w-full col-span-1 lg:col-span-3 xl:col-span-1">
                    <CardHeader>
                        <h3 className="text-xl font-medium">Task Completion Rate</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="w-full h-[400px] overflow-hidden">
                            <Chart
                                options={completionChartOptions}
                                series={completionSeries}
                                type="line"
                                height="100%"
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className={`space-y-2 max-w-3xl mx-auto ${isExample ? "opacity-40" : ""}`}>
                {!hasEntryThisWeek && (
                    <Card
                        isPressable={true}
                        onPress={() => router.push("/new")}
                        className="bg-success-50 dark:bg-success-100 w-full"
                    >
                        <CardBody className="py-2">
                            <span className="text-success text-lg font-semibold">+ Create Entry for This Week</span>
                        </CardBody>
                    </Card>
                )}
                {diaries.toReversed().map((diary) => (
                    <Card key={diary.name} className="w-full">
                        <CardHeader className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold">
                                    {format(convertProtoTimestampToDate(diary.entryTime!), "MMM d, yyyy")}
                                </h3>
                                <span className="text-sm text-default-500">{diary.project}</span>
                            </div>
                            <div className="flex gap-1">
                                {diary.editableDiary && (
                                    <Button
                                        color="primary"
                                        variant="light"
                                        size="sm"
                                        onPress={() => router.push(`/new?edit=${diary.name}`)}
                                    >
                                        Edit
                                    </Button>
                                )}
                                {diary.editableDiary && (
                                    <Button
                                        color="danger"
                                        variant="light"
                                        size="sm"
                                        onPress={() => {
                                            if (window.confirm("Are you sure you want to delete this entry?")) {
                                                webClient
                                                    .deleteDiary({
                                                        name: diary.name,
                                                    })
                                                    .then(() => {
                                                        router.refresh();
                                                    });
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody className="py-2">
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-10 gap-4">
                                    <Table
                                        removeWrapper={true}
                                        aria-label="Diary metrics table"
                                        hideHeader={true}
                                        className="col-span-3"
                                    >
                                        <TableHeader>
                                            <TableColumn>Label</TableColumn>
                                            <TableColumn>Value</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-semibold pr-4 w-1/3">
                                                    Weeks till completion:
                                                </TableCell>
                                                <TableCell>{diary.completionWeeks}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-semibold pr-4">Motivation:</TableCell>
                                                <TableCell>{diary.motivation}/10</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>

                                    <Table
                                        removeWrapper={true}
                                        aria-label="Diary feedback table"
                                        hideHeader={true}
                                        className="col-span-7"
                                    >
                                        <TableHeader>
                                            <TableColumn>Label</TableColumn>
                                            <TableColumn>Value</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-semibold text-success pr-4 w-1/3">
                                                    Learnings:
                                                </TableCell>
                                                <TableCell>{diary.learnings}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-semibold text-danger pr-4">
                                                    Obstacles:
                                                </TableCell>
                                                <TableCell>{diary.obstacles}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex gap-4">
                                    <span className="font-semibold">Goals:</span>
                                    <div className="flex flex-col gap-1">
                                        {diary.goals.map((goal, index) => (
                                            <Checkbox
                                                key={goal.title}
                                                isSelected={goal.completed}
                                                onValueChange={(checked) =>
                                                    handleGoalChange(diary.name, index, checked)
                                                }
                                                size="sm"
                                                lineThrough={true}
                                            >
                                                <span className="text-sm break-words">{goal.title}</span>
                                            </Checkbox>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
