"use client";

import webClient from "@/api";
import type { Diary, Diary_DiaryGoal } from "@arkadiahn/apis/intra/v1/diary_pb";

import type { Session } from "@/auth/models";
import { Button, Card, CardBody, Input, Select, SelectItem, Slider, Textarea } from "@heroui/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getTargetSunday } from "./DiaryOverview";

interface DiaryPageProps {
    session: Session | null;
    initialDiary?: Diary; // Optional prop for editing
}

export default function DiaryPage({ session, initialDiary }: DiaryPageProps) {
    const PROJECT_OPTIONS = [
        "Libft",
        "born2beroot",
        "ft_printf",
        "get_next_line",
        "push_swap",
        "minitalk",
        "pipex",
        "so_long",
        "FdF",
        "fract-ol",
        "Philosophers",
        "minishell",
        "cub3d",
        "miniRT",
        "NetPractice",
        "CPP Module 00-04",
        "CPP Module 05-09",
        "ft_irc",
        "webserv",
        "Inception",
        "ft_transcendence",
    ];

    const [error, setError] = useState<string | null>(null);
    const [useCustomProject, setUseCustomProject] = useState(
        initialDiary ? !PROJECT_OPTIONS.includes(initialDiary.project) : false,
    );

    const [newEntry, setNewEntry] = useState<Diary>({
        $typeName: "arkadiahn.intra.v1.Diary",
        name: initialDiary?.name || "",
        entryTime: initialDiary?.entryTime || getTargetSunday(),
        project: initialDiary?.project || "",
        completionWeeks: initialDiary?.completionWeeks || 1,
        motivation: initialDiary?.motivation || 5,
        learnings: initialDiary?.learnings || "",
        obstacles: initialDiary?.obstacles || "",
        goals: initialDiary?.goals || [
            {
                $typeName: "arkadiahn.intra.v1.Diary.DiaryGoal",
                title: "",
                completed: false,
            },
        ],
        accountId: session?.user.id || "",
        editableDiary: true,
        editableGoalCompletion: true,
    });

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user.id) {
            setError("You must be logged in to create or update a diary entry");
            return;
        }

        try {
            const filteredGoals = newEntry.goals.filter((g) => g.title.trim() !== "");

            if (initialDiary) {
                // Handle update
                try {
                    const _response = await webClient.updateDiary({
                        diary: {
                            ...newEntry,
                            name: initialDiary.name,
                            goals: filteredGoals,
                        },
                    });
                    router.push("/");
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        // Handle specific gRPC error codes if available
                        const grpcError = err as { code?: number; message: string };
                        const errorMessage = grpcError.code
                            ? `Error (${grpcError.code}): ${grpcError.message}`
                            : grpcError.message;
                        setError(`Failed to update diary: ${errorMessage}`);
                    } else {
                        setError("An unexpected error occurred while updating the diary");
                    }
                    console.error("Diary update error:", err);
                }
            } else {
                // Handle create
                try {
                    const _response = await webClient.createDiary({
                        parent: `accounts/${session.user.id}`,
                        diary: {
                            ...newEntry,
                            goals: filteredGoals,
                        },
                    });
                    router.push("/");
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        // Handle specific gRPC error codes if available
                        const grpcError = err as { code?: number; message: string };
                        const errorMessage = grpcError.code
                            ? `Error (${grpcError.code}): ${grpcError.message}`
                            : grpcError.message;
                        setError(`Failed to create diary: ${errorMessage}`);
                    } else {
                        setError("An unexpected error occurred while creating the diary");
                    }
                    console.error("Diary creation error:", err);
                }
            }
        } catch (err) {
            setError("An unexpected error occurred while processing your request");
            console.error("Unexpected error:", err);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!session) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardBody className="px-8 py-6">
                    <h2 className="text-2xl font-medium mb-6">{initialDiary ? "Edit Entry" : "New Entry"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="useCustomProject"
                                        checked={useCustomProject}
                                        onChange={(e) => setUseCustomProject(e.target.checked)}
                                    />
                                    <label htmlFor="useCustomProject">Use custom project name</label>
                                </div>

                                {useCustomProject ? (
                                    <Input
                                        type="text"
                                        label="Custom project name"
                                        value={newEntry.project}
                                        onChange={(e) => setNewEntry({ ...newEntry, project: e.target.value })}
                                        placeholder="Enter project name"
                                        isRequired={true}
                                    />
                                ) : (
                                    <Select
                                        label="Project you are currently working on"
                                        selectedKeys={newEntry.project ? [newEntry.project] : []}
                                        onChange={(e) => setNewEntry({ ...newEntry, project: e.target.value })}
                                        isRequired={true}
                                    >
                                        {PROJECT_OPTIONS.map((project) => (
                                            <SelectItem key={project} textValue={project}>
                                                {project}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            </div>

                            <Input
                                type="number"
                                label="Expected weeks until completion"
                                min={1}
                                value={newEntry.completionWeeks.toString()}
                                onChange={(e) =>
                                    setNewEntry({ ...newEntry, completionWeeks: Number.parseInt(e.target.value) })
                                }
                                isRequired={true}
                            />

                            <div className="flex items-center gap-4 w-full">
                                <Slider
                                    label="Motivation"
                                    step={1}
                                    maxValue={10}
                                    minValue={1}
                                    size="md"
                                    color="success"
                                    value={newEntry.motivation || 5}
                                    onChange={(value) => setNewEntry({ ...newEntry, motivation: value as number })}
                                    className="flex-1"
                                    showSteps={true}
                                    aria-label="Motivation level"
                                    renderThumb={(props) => (
                                        <div
                                            {...props}
                                            className="group p-2 top-1/2 bg-transparent cursor-grab data-[dragging=true]:cursor-grabbing"
                                        >
                                            <span
                                                className={`flex items-center justify-center w-8 h-8 ${newEntry.motivation === 10 ? "text-6xl" : "text-4xl"}`}
                                                role="img"
                                                aria-label="mood"
                                            >
                                                {newEntry.motivation === 1
                                                    ? "😭"
                                                    : newEntry.motivation === 2
                                                      ? "😢"
                                                      : newEntry.motivation === 3
                                                        ? "😞"
                                                        : newEntry.motivation === 4
                                                          ? "😕"
                                                          : newEntry.motivation === 5
                                                            ? "😐"
                                                            : newEntry.motivation === 6
                                                              ? "🙂"
                                                              : newEntry.motivation === 7
                                                                ? "😊"
                                                                : newEntry.motivation === 8
                                                                  ? "😄"
                                                                  : newEntry.motivation === 9
                                                                    ? "🤩"
                                                                    : "🤯"}
                                            </span>
                                        </div>
                                    )}
                                />
                            </div>

                            <Textarea
                                label="Biggest learnings last week"
                                value={newEntry.learnings}
                                onChange={(e) => setNewEntry({ ...newEntry, learnings: e.target.value })}
                                minRows={4}
                            />

                            <Textarea
                                label="Biggest obstacles last week"
                                value={newEntry.obstacles}
                                onChange={(e) => setNewEntry({ ...newEntry, obstacles: e.target.value })}
                                minRows={4}
                            />

                            <div className="space-y-4">
                                <span className="block text-sm font-medium">Your goals for next week</span>
                                {newEntry.goals.map((goal, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            key={`goal-${index}`}
                                            type="text"
                                            value={goal.title}
                                            onChange={(e) => {
                                                const newGoals = [...newEntry.goals];
                                                newGoals[index].title = e.target.value;
                                                setNewEntry({ ...newEntry, goals: newGoals });
                                            }}
                                            placeholder="Enter a goal"
                                        />
                                        <Button
                                            color="danger"
                                            onClick={() => {
                                                const newGoals = newEntry.goals.filter((_, i) => i !== index);
                                                setNewEntry({ ...newEntry, goals: newGoals });
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    color="primary"
                                    onPress={() =>
                                        setNewEntry({
                                            ...newEntry,
                                            goals: [
                                                ...newEntry.goals,
                                                {
                                                    title: "",
                                                    completed: false,
                                                    $typeName: "arkadiahn.intra.v1.Diary.DiaryGoal",
                                                },
                                            ],
                                        })
                                    }
                                >
                                    Add Goal
                                </Button>
                            </div>

                            <div>
                                <Button type="submit" color="success" size="lg">
                                    {initialDiary ? "Update Entry" : "Create Entry"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
