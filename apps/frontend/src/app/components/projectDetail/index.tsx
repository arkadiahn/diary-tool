"use client";

import { BreadcrumbItem, Breadcrumbs, Button, Tooltip } from "@nextui-org/react";
import ProjectState from "../common/projectState";
import CustomIcon from "../common/CustomIcon";
import { Project } from "@/api/missionboard";
import {Chip} from "@nextui-org/react";

import icGithubFill from "@iconify/icons-ri/github-fill";
import TimeStepper from "../missionView/timeStepper";
import icCalendarEventFill from "@iconify/icons-ri/calendar-event-fill";
import icTimeFill from "@iconify/icons-ri/time-fill";


interface ProjectDetailViewProps {
	data: Project;
}
export default function ProjectDetailView({ data }: ProjectDetailViewProps) {
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
                    <BreadcrumbItem href="/">MissionBoard</BreadcrumbItem>
                    <BreadcrumbItem>{data.title}</BreadcrumbItem>
                </Breadcrumbs>

                <div className="bg-content1 rounded-large p-6 shadow-small">
					<div className="flex justify-between items-center mb-2">
						<div className="flex gap-2 items-center">
							<h1 className="text-2xl font-bold">{data.title}</h1>
							<ProjectState state={data.project_state} />
						</div>
						<div className="flex gap-2 items-center">
							<div className="flex items-center gap-1">
								<div className="flex items-center gap-2">
									<Tooltip content="Project Start Date">
										<div className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary rounded-full px-3 py-1 cursor-help">
											<CustomIcon icon={icCalendarEventFill} width={16} />
											<span className="text-sm font-medium">
												{new Date(data.kickoff_time).toLocaleDateString('en-US', {
													year: 'numeric',
													month: 'short',
													day: 'numeric'
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
												{new Date(data.end_time ?? new Date()).toLocaleDateString('en-US', {
													year: 'numeric',
													month: 'short',
													day: 'numeric'
												})}
											</span>
										</div>
									</Tooltip>
								</div>
							</div>
							<Button
								as="a"
								href={data.github_link}
								target="_blank"
								variant="light"
								onPress={() => {}}
							>
								GitHub
								<CustomIcon 
									width={28}
									icon={icGithubFill}
								/>
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<div className="space-y-2">
								<h3 className="text-md font-bold">Description</h3>
								<p>{data.description}</p>
							</div>
							<div className="mt-4 space-y-2">
								<h3 className="text-md font-bold">Goal</h3>
								<p>{data.description_goal}</p>
							</div>
						</div>
						<div className="space-y-4 flex flex-col items-end text-right">
							<div className="space-y-2">
								<h3 className="text-md font-bold">Needed Skills</h3>
								<div className="flex flex-wrap gap-1 justify-end">
									{data.description_skills.split(", ").map((skill) => (
										<Chip key={skill} className="text-xs" color="primary">{skill}</Chip>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className="w-full space-y-2 mt-4">
						<h3 className="text-md font-bold">Timeline</h3>
						<TimeStepper stepsCount={6} currentStep={2} />
					</div>
                </div>
            </div>
        </>
    );
}
