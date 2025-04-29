"use client";

import webClient from "@/api";
import { type MissionMilestone, MissionMilestone_State } from "@arkadiahn/apis/intra/v1/mission_milestone_pb";
import type { Mission } from "@arkadiahn/apis/intra/v1/mission_pb";

import { dateToTimestamp, timestampToDate } from "@/api/utils";
import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    DatePicker,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ScrollShadow,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea,
    useDisclosure,
} from "@heroui/react";
import { now, parseAbsolute, parseZonedDateTime } from "@internationalized/date";
import clsx from "clsx";
import { useState } from "react";
import YouTube from "react-youtube";
import DateComponent from "../../admin/missions/DateComponent";
import MainPageLayout from "../../src/components/MainPageLayout";
import RowSteps from "./RowSteps";
import VerticalSteps from "./VerticalSteps";
import { useSession } from "@/auth/client";

interface MissionDetailsViewProps {
    children: React.ReactNode;
    title: string;
    view: boolean;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    submit?: boolean;
    className?: string;
    noScroll?: boolean;
    buttonsDisabled?: boolean;
    noBackButton?: boolean;
}
function MissionDetailsView({
    children,
    title,
    view,
    setStep,
    submit,
    className,
    noScroll,
    buttonsDisabled,
    noBackButton,
}: MissionDetailsViewProps) {
    return (
        <div
            className={clsx("w-full flex flex-col justify-between h-full max-h-full gap-5", {
                hidden: !view,
            })}
        >
            <h1 className="text-2xl font-bold self-start px-1">{title}</h1>
            {!noScroll && (
                <ScrollShadow className={clsx("flex flex-col gap-5 h-full p-1 pr-2", className)}>
                    {children}
                </ScrollShadow>
            )}
            {noScroll && <div className={clsx("w-full h-full flex flex-col gap-5 px-1", className)}>{children}</div>}
            <div
                className={clsx("w-full flex flex-row gap-2 overflow-x-visible px-1", {
                    "justify-end": noBackButton,
                    "justify-between": !noBackButton,
                })}
            >
                {!noBackButton && (
                    <Button isDisabled={buttonsDisabled} onPress={() => setStep((prev) => prev - 1)}>
                        Back
                    </Button>
                )}
                <Button
                    isDisabled={buttonsDisabled}
                    color="primary"
                    type={submit ? "submit" : "button"}
                    onPress={!submit ? () => setStep((prev) => prev + 1) : undefined}
                >
                    {submit ? "Submit" : "Next"}
                </Button>
            </div>
        </div>
    );
}

export default function CreateMissionPage() {
    const { isOpen, onOpenChange } = useDisclosure();
    const [selectedMilestone, setSelectedMilestone] = useState<MissionMilestone | null>(null);
    const [milestones, setMilestones] = useState<MissionMilestone[]>([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [_loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
	const { session } = useSession();

    const submitMission = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
        setLoading(true);
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        formData.kickoff_time = parseZonedDateTime(formData.kickoff_time as string)
            .toDate()
            .toISOString();
        formData.end_time = parseZonedDateTime(formData.end_time as string)
            .toDate()
            .toISOString();
		formData.leader = `accounts/${session?.user.id}`
        const mission = await webClient.createMission({
            mission: formData as unknown as Mission,
        });
        await Promise.all(
            milestones.map((milestone) =>
                webClient.createMissionMilestone({
                    parent: mission.name,
                    missionMilestone: {
                        ...milestone,
                        name: ""
                    },
                }),
            ),
        );
        setLoading(false);
        setStep((prev) => prev + 1);
    };

    const onAddMilestone = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const milestone: MissionMilestone = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            endTime: dateToTimestamp(parseZonedDateTime(formData.get("end_time") as string).toDate()),
        } as MissionMilestone;
        if (selectedMilestone) {
            setMilestones(milestones.map((m) => (m.name === selectedMilestone.name ? milestone : m)));
        } else {
            milestone.name = `${milestones.length + 1}`;
            setMilestones((prev) => [...prev, milestone]);
        }
        setSelectedMilestone(null);
        onOpenChange();
    };

    return (
        <>
            <MainPageLayout className="overflow-visible flex flex-col gap-5">
                <Breadcrumbs size="lg" className="self-start font-medium">
                    <BreadcrumbItem href="/">Missions</BreadcrumbItem>
                    <BreadcrumbItem>Create Mission</BreadcrumbItem>
                </Breadcrumbs>
                <div className="flex-1 flex flex-col xl:flex-row min-h-0 w-full">
                    <RowSteps
                        className="!w-full !max-w-full mb-6 xl:mb-0 xl:hidden"
                        currentStep={step}
                        onStepChange={setStep}
                        steps={[
                            { title: "What is a mission?", minWidth: 120 },
                            { title: "Mission Non-Profit?", minWidth: 120 },
                            { title: "Mission Details", minWidth: 120 },
                            { title: "Mission Milestones", minWidth: 120 },
                        ]}
                    />
                    <VerticalSteps
                        className="hidden xl:flex xl:mr-6"
                        currentStep={step}
                        onStepChange={setStep}
                        steps={[
                            {
                                title: "What is a Mission?",
                                description: "Get introduced to missions",
                                disabled: true,
                            },
                            {
                                title: "Mission Non-Profit?",
                                description: "Enter the non-profit of the mission",
                                disabled: !videoEnded,
                            },
                            {
                                title: "Mission Details",
                                description: "Enter the details of the mission",
                                disabled: !videoEnded,
                            },
                            {
                                title: "Mission Milestones",
                                description: "Enter the milestones of the mission",
                                disabled: !videoEnded,
                            },
                        ]}
                    />
                    {step === 0 && (
                        <div className="flex-1 flex flex-col justify-between h-full items-end gap-5">
                            <MissionDetailsView
                                title="What is a Mission?"
                                buttonsDisabled={!videoEnded}
                                view={true}
                                noScroll={true}
                                setStep={setStep}
                                noBackButton={true}
                            >
                                <YouTube
                                    className="w-full h-full"
                                    videoId="BBJa32lCaaY"
                                    opts={{
                                        width: "100%",
                                        height: "50%",
                                        playerVars: {
                                            autoplay: 1,
                                            controls: 0,
                                            rel: 0,
											mute: 1
                                        },
                                    }}
                                    onEnd={() => setVideoEnded(true)}
                                />
                            </MissionDetailsView>
                        </div>
                    )}
                    {step === 1 && (
                        <div className="flex-1 flex flex-col items-end justify-between h-full gap-5">
                            <MissionDetailsView
                                title="Mission Non-Profit?"
                                view={true}
                                setStep={setStep}
                                noBackButton={true}
                            >
                                <p>Mission Non-Profit?</p>
                            </MissionDetailsView>
                        </div>
                    )}
                    {(step === 2 || step === 3) && (
                        <Form onSubmit={submitMission} className="flex-1 flex flex-col w-full">
                            <MissionDetailsView
                                title="Mission Details"
                                view={step === 2}
                                setStep={setStep}
                                aria-label="Mission Details"
                            >
                                <Input
                                    size="sm"
                                    label="Mission Name"
                                    name="title"
                                    placeholder="Enter mission name"
                                    isRequired={true}
                                />
                                <DatePicker
                                    size="sm"
                                    label="Kickoff Time"
                                    name="kickoff_time"
                                    placeholderValue={now("Europe/Berlin")}
                                    description="The time where the team formation happens and the mission starts"
                                    isRequired={true}
                                />
								<DatePicker
                                    size="sm"
                                    label="End Time"
                                    name="end_time"
                                    placeholderValue={now("Europe/Berlin")}
                                    description="The time where the mission ends"
                                    isRequired={true}
                                />
                                <Textarea
                                    size="sm"
                                    label="Description"
                                    name="description"
                                    placeholder="Enter mission description"
                                    description="Enter the description of the mission"
                                    disableAnimation={true}
                                    disableAutosize={true}
                                    classNames={{
                                        input: "resize-y min-h-[100px]",
                                    }}
                                    isRequired={true}
                                />
                                <Textarea
                                    size="sm"
                                    label="Description Goal"
                                    name="description_goal"
                                    placeholder="Enter mission description goal"
                                    description="Enter the description goal of the mission"
                                    disableAnimation={true}
                                    disableAutosize={true}
                                    classNames={{
                                        input: "resize-y min-h-[100px]",
                                    }}
                                    isRequired={true}
                                />
                                <Textarea
                                    size="sm"
                                    label="Required Skills"
                                    name="description_skills"
                                    placeholder="Enter mission required skills"
                                    description="Enter the required skills of the mission"
                                    disableAnimation={true}
                                    disableAutosize={true}
                                    classNames={{
                                        input: "resize-y min-h-[100px]",
                                    }}
                                    isRequired={true}
                                />
                                <Input
                                    size="sm"
                                    label="GitHub Link"
                                    name="github_link"
                                    placeholder="https://github.com/example"
                                    description="Enter the GitHub link of the mission"
                                />
                            </MissionDetailsView>
                            <MissionDetailsView
                                title="Mission Milestones"
                                view={step === 3}
                                setStep={setStep}
                                submit={true}
                                aria-label="Mission Milestones"
                            >
                                <Table
                                    maxTableHeight={300}
                                    className="h-full"
                                    removeWrapper={true}
                                    bottomContent={
                                        <Button
                                            size="sm"
                                            fullWidth={true}
                                            onPress={() => {
                                                setSelectedMilestone(null);
                                                onOpenChange();
                                            }}
                                        >
                                            Add Milestone
                                        </Button>
                                    }
                                >
                                    <TableHeader>
                                        <TableColumn>Title</TableColumn>
                                        <TableColumn>Description</TableColumn>
                                        <TableColumn width={200}>End Time</TableColumn>
                                        <TableColumn width={200}>Actions</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="No milestones added yet">
                                        {milestones.map((milestone, index) => (
                                            <TableRow key={`${milestone.title}-${milestone.endTime}-${index}`}>
                                                <TableCell>{milestone.title}</TableCell>
                                                <TableCell>{milestone.description}</TableCell>
                                                <TableCell>
                                                    <DateComponent
                                                        date={timestampToDate(milestone.endTime)?.toISOString() ?? ""}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-row gap-2">
                                                        <Button
                                                            size="sm"
                                                            color="primary"
                                                            onPress={() => {
                                                                setSelectedMilestone(milestone);
                                                                onOpenChange();
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            color="danger"
                                                            onPress={() => {
                                                                setMilestones(
                                                                    milestones.filter((_, i) => i !== index),
                                                                );
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </MissionDetailsView>
                        </Form>
                    )}
                    {step === 4 && (
                        <div className="flex-1 flex flex-col items-end gap-5">
                            <h1 className="text-2xl font-bold self-start">Await Approval</h1>
                            <p className="self-start">
                                Your mission has been submitted for approval. Once approved, it will be published and
                                visible to the public.
                            </p>
                        </div>
                    )}
                </div>
            </MainPageLayout>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
                <ModalContent>
                    <Form onSubmit={onAddMilestone}>
                        <ModalHeader>
                            <h1 className="text-2xl font-bold">Milestone Details</h1>
                        </ModalHeader>
                        <ModalBody className="w-full flex flex-col gap-6">
                            <Input
                                size="sm"
                                label="Title"
                                name="title"
                                defaultValue={selectedMilestone?.title}
                                placeholder="Enter milestone title"
                                isRequired={true}
                            />
                            <Textarea
                                size="sm"
                                label="Description"
                                name="description"
                                defaultValue={selectedMilestone?.description}
                                placeholder="Enter milestone description"
                                isRequired={true}
                            />
                            <DatePicker
                                size="sm"
                                label="End Time"
                                name="end_time"
                                defaultValue={
                                    selectedMilestone?.endTime
                                        ? parseAbsolute(
                                              timestampToDate(selectedMilestone.endTime)?.toISOString() ?? "",
                                              "Europe/Berlin",
                                          )
                                        : null
                                }
                                placeholderValue={now("Europe/Berlin")}
                                isRequired={true}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">
                                {selectedMilestone ? "Edit Milestone" : "Add Milestone"}
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalContent>
            </Modal>
        </>
    );
}
