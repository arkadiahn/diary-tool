"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/react";

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

export default function ProjectSelect({ project }: { project?: string }) {
    return (
        <Autocomplete
            name="project"
            label="Project you are currently working on"
            allowsCustomValue={true}
            isRequired={true}
            defaultSelectedKey={PROJECT_OPTIONS.includes(project || "") ? project : undefined}
            defaultInputValue={project}
            maxLength={255}
            minLength={3}
            placeholder="Select or enter a project"
            className="w-full"
        >
            {PROJECT_OPTIONS.map((project) => (
                <AutocompleteItem key={project}>{project}</AutocompleteItem>
            ))}
        </Autocomplete>
    );
}
