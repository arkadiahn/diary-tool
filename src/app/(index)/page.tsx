import { auth } from "@/auth";
import prisma from "@/prisma";
import { Card, CardBody, CardHeader } from "@heroui/react";
import clsx from "clsx";
import Link from "next/link";
import CustomChart from "./CustomChart";
import example_entries from "./example_entries";
import { getHasEntryThisWeek } from "@/helpers";

import EntryCard from "./EntryCard";

export default async function HomePage() {
    const session = await auth();
    let diaries = await prisma.diary.findMany({
        include: { goals: true },
        where: {
            accountId: session?.user.sub,
        },
    });
    const isExample = !diaries.length;
    if (isExample) {
        diaries = example_entries;
    }
    diaries = diaries.sort((a, b) => a.entryTime.getTime() - b.entryTime.getTime());
    const hasEntryThisWeek = !isExample && getHasEntryThisWeek(diaries);

    const entryDates = diaries.map((diary) => diary.entryTime.getTime());
    const entryLabels = diaries
        .map((diary) => {
            if (diaries.indexOf(diary) === 0 || diary.project !== diaries[diaries.indexOf(diary) - 1].project) {
                return {
                    title: diary.project,
                    date: diary.entryTime.getTime(),
                };
            }
            return null;
        })
        .filter((label) => label !== null);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-10">
            {isExample && (
                <div className="mb-6 space-y-4">
                    {session && (
                        <Card
                            as={Link}
                            href="/entry"
                            isPressable={true}
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

            <div
                className={clsx(
                    "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8",
                    isExample ? "opacity-60 pointer-events-none" : "",
                )}
            >
                <Card className="w-full col-span-1 lg:col-span-3 xl:col-span-1">
                    <CardHeader>
                        <h3 className="text-xl font-medium">Motivation Over Time</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="w-full h-[400px] overflow-hidden">
                            <CustomChart
                                title="Motivation"
                                color="#006FEE"
                                data={diaries.map((diary) => diary.motivation)}
                                dates={entryDates}
                                labels={entryLabels}
                                yaxis={{
                                    max: 10,
                                }}
                                tooltiptext="/10"
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
                            <CustomChart
                                title="Weeks till completion"
                                color="#17C964"
                                data={diaries.map((diary) => diary.completionWeeks)}
                                dates={entryDates}
                                labels={entryLabels}
                                yaxis={{
                                    max: Math.max(...diaries.map((diary) => diary.completionWeeks)),
                                }}
                                tooltiptext=" weeks"
                            />
                        </div>
                    </CardBody>
                </Card>

                <Card className="w-full col-span-1 lg:col-span-3 xl:col-span-1">
                    <CardHeader>
                        <h3 className="text-xl font-medium">Task Completion Rate</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="w-full h-[400px] overflow-hidden">
                            <CustomChart
                                title="Tasks Completed"
                                color="#F5A524"
                                data={diaries.map((diary) => {
                                    if (diary.goals.length === 0) {
                                        return 0;
                                    }
                                    const completedTasks = diary.goals.filter((goal) => goal.completed).length;
                                    return Math.round((completedTasks / diary.goals.length) * 100);
                                })}
                                dates={entryDates}
                                labels={entryLabels}
                                yaxis={{
                                    max: 100,
                                }}
                                yaxistext="%"
                                tooltiptext="%"
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className={clsx("space-y-2 max-w-5xl mx-auto", isExample ? "opacity-40 pointer-events-none" : "")}>
                {!hasEntryThisWeek && (
                    <Card className="bg-success-50 dark:bg-success-100 w-full" isPressable={true} href="/entry" as={Link}>
                        <CardBody className="py-2">
                            <span className="text-success text-lg font-semibold">+ Create Entry for This Week</span>
                        </CardBody>
                    </Card>
                )}
                {diaries.toReversed().map((diary) => (
                    <EntryCard key={diary.id} diary={diary} />
                ))}
            </div>
        </div>
    );
}
