"use client";

import type { Prisma } from "@/generated/prisma";
import { CardBody, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Card, CardHeader } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { Button } from "@heroui/react";
import { format } from "date-fns";
import Link from "next/link";

import { handleDelete, handleGoalChange } from "./actions";

type DiaryWithGoals = Prisma.DiaryGetPayload<{
    include: { goals: true };
}>;

export default function EntryCard({ diary }: { diary: DiaryWithGoals }) {
    return (
        <Card key={diary.id} className="w-full">
            <CardHeader className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{format(diary.entryTime, "MMM d, yyyy")}</h3>
                    <span className="text-sm text-default-500">{diary.project}</span>
                </div>
                <div className="flex gap-1">
                    {true && (
                        <Button href={`/new/${diary.id}`} color="primary" variant="light" size="sm" as={Link}>
                            Edit
                        </Button>
                    )}
                    {true && (
                        <form
                            action={handleDelete}
                            onSubmit={(e) => {
                                if (!window.confirm("Are you sure you want to delete this entry?")) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <input type="hidden" name="id" value={diary.id} />
                            <Button type="submit" color="danger" variant="light" size="sm">
                                Delete
                            </Button>
                        </form>
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
                                    <TableCell className="font-semibold pr-4 w-1/3">Weeks till completion:</TableCell>
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
                                    <TableCell className="font-semibold text-success pr-4 w-1/3">Learnings:</TableCell>
                                    <TableCell>{diary.learnings}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold text-danger pr-4">Obstacles:</TableCell>
                                    <TableCell>{diary.obstacles}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex gap-4">
                        <span className="font-semibold">Goals:</span>
                        <div className="flex flex-col gap-1">
                            {diary.goals
                                .sort(
                                    (a, b) =>
                                        a.createTime.getTime() - b.createTime.getTime() || a.id.localeCompare(b.id),
                                )
                                .map((goal) => (
                                    <Checkbox
                                        key={goal.title}
                                        name={`goal.${goal.id}`}
                                        isSelected={goal.completed}
                                        onChange={() => {
                                            handleGoalChange(goal.id, !goal.completed);
                                        }}
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
    );
}
