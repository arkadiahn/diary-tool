"use client";

import webClient from "@/api";
import { createFieldMask, timestampToDate } from "@/api/utils";
import type { Account } from "@arkadiahn/apis/intra/v1/account_pb";
import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";

import CustomIcon from "@/components/CustomIcon";
import { DatePicker } from "@heroui/date-picker";
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Input, Textarea } from "@heroui/react";
import icGithubFill from "@iconify/icons-ri/github-fill";
import { parseDate } from "@internationalized/date";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MissionState from "../../../missions/MissionState";

function ProjectLeaderChip({ account }: { account: string }) {
    const [accountData, setAccountData] = useState<Account | null>(null);

    useEffect(() => {
        const fetchLeader = async () => {
            try {
                const accountResponse = await webClient.getAccount({
                    name: account,
                });
                setAccountData(accountResponse);
            } catch (_error) {
                setAccountData(null);
            }
        };

        fetchLeader();
    }, [account]);

    return (
        <div className="flex items-center gap-2">
            <Chip
                size="sm"
                variant="flat"
                color="primary"
                classNames={{
                    base: "px-2 py-1",
                    content: "text-xs font-medium",
                }}
            >
                Project Leader
            </Chip>
            <span className="text-sm text-default-600">{accountData?.nick || "Loading..."}</span>
        </div>
    );
}

interface MissionEditProps {
    data: Mission;
}

export default function MissionEdit({ data }: MissionEditProps) {
    const [formData, setFormData] = useState<Mission>(data);
    const [skills, setSkills] = useState(data.descriptionSkills.split(", "));
    const [newSkill, setNewSkill] = useState("");
    const router = useRouter();

    const onSave = async (mission: Mission) => {
        try {
            if (mission.name !== "---") {
                await webClient.updateMission({
                    mission: mission,
                    updateMask: createFieldMask(mission),
                });
                router.push(`/${mission.name}`);
            } else {
                await webClient.createMission({
                    mission: mission,
                });
                router.push(`/${mission.name}`);
            }
        } catch (error) {
            console.error("Failed to save project:", error);
        }
    };

    const handleSkillAdd = () => {
        if (newSkill && !skills.includes(newSkill)) {
            const updatedSkills = [...skills, newSkill];
            setSkills(updatedSkills);
            setFormData((prev) => ({
                ...prev,
                description_skills: updatedSkills.join(", "),
            }));
            setNewSkill("");
        }
    };

    const handleSkillRemove = (skillToRemove: string) => {
        const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
        setSkills(updatedSkills);
        setFormData((prev) => ({
            ...prev,
            description_skills: updatedSkills.join(", "),
        }));
    };

    return (
        <div className="w-full p-6">
            <Breadcrumbs
                size="lg"
                className="mb-5"
                itemClasses={{
                    item: "text-default-600",
                    separator: "text-default-400",
                }}
            >
                <BreadcrumbItem href="/">MissionBoard</BreadcrumbItem>
                <BreadcrumbItem href={`/${data.name}`}>{data.title}</BreadcrumbItem>
                <BreadcrumbItem>Edit</BreadcrumbItem>
            </Breadcrumbs>
            <form
                className="bg-content1 rounded-large p-6 shadow-small"
                onSubmit={async (e) => {
                    e.preventDefault();
                    await onSave(formData);
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2 items-center flex-1">
                        <Input
                            label="Project Title"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            className="max-w-md"
                            isRequired={true}
                            maxLength={255}
                            errorMessage={formData.title.length > 255 && "Title must be less than 255 characters"}
                        />
                        <MissionState state={data.state} />
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-2">
                            <DatePicker
                                label="Start Date"
                                value={parseDate(
                                    timestampToDate(formData.kickoffTime)?.toISOString().split("T")[0] ?? "",
                                )}
                                onChange={(date) => {
                                    if (date) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            kickoff_time: date.toString(),
                                        }));
                                    }
                                }}
                                isRequired={true}
                            />
                            <DatePicker
                                label="End Date"
                                value={
                                    formData.endTime
                                        ? parseDate(
                                              timestampToDate(formData.endTime)?.toISOString().split("T")[0] ?? "",
                                          )
                                        : null
                                }
                                onChange={(date) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        end_time: date ? date.toString() : undefined,
                                    }));
                                }}
                            />
                        </div>
                        <Input
                            label="GitHub Link"
                            value={formData.githubLink}
                            onChange={(e) => setFormData((prev) => ({ ...prev, github_link: e.target.value }))}
                            startContent={<CustomIcon icon={icGithubFill} width={16} />}
                            type="url"
                            pattern="https://github.com/.*"
                            errorMessage={
                                formData.githubLink &&
                                !/^https:\/\/github\.com\/.*/.test(formData.githubLink) &&
                                "Must be a valid GitHub URL"
                            }
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <Textarea
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            minRows={4}
                            isRequired={true}
                            maxLength={1000}
                            errorMessage={
                                formData.description.length > 1000 && "Description must be less than 1000 characters"
                            }
                        />
                        <Textarea
                            label="Goal"
                            value={formData.descriptionGoal}
                            onChange={(e) => setFormData((prev) => ({ ...prev, descriptionGoal: e.target.value }))}
                            minRows={4}
                            isRequired={true}
                            maxLength={1000}
                            errorMessage={
                                formData.descriptionGoal.length > 1000 && "Goal must be less than 1000 characters"
                            }
                        />
                        <ProjectLeaderChip account={formData.leader} />
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-md font-medium">Searched Skills</h3>
                            <div className="flex flex-wrap gap-1 justify-end mb-2 min-h-[40px]">
                                {skills.length > 0 ? (
                                    skills.map((skill) => (
                                        <Chip
                                            key={skill}
                                            className="text-xs"
                                            color="primary"
                                            onClose={() => handleSkillRemove(skill)}
                                            variant="flat"
                                        >
                                            {skill}
                                        </Chip>
                                    ))
                                ) : (
                                    <p className="text-default-400 text-sm italic">
                                        No skills added yet. Add skills below.
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a skill"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSkillAdd()}
                                />
                                <Button onPress={handleSkillAdd}>Add</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button color="danger" variant="light" onPress={() => router.back()}>
                        Cancel
                    </Button>
                    <Button color="primary" type="submit">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
