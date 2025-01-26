"use client";

import { createDiary } from '@/api/missionboard';
import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Input, Textarea, Select, SelectItem, Button, Card, CardBody } from "@heroui/react";
import { Session } from "@/auth/models";

interface DiaryPageProps {
  session: Session | null;
}

export default function DiaryPage({ session }: DiaryPageProps) {
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
    "ft_transcendence"
  ];

  const [error, setError] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState({
    entry_date: format(new Date(), 'yyyy-MM-dd'),
    project: '',
    completion_weeks: 1,
    motivation: 5,
    learnings: '',
    obstacles: '',
    goals: [{ title: '', completed: false }]
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const filteredGoals = newEntry.goals.filter(g => g.title.trim() !== '');
      await createDiary("me", {
        ...newEntry,
        goals: filteredGoals
      });
      
      router.push('/');
    } catch (error) {
      console.log(error);
      setError('Failed to create diary entry');
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">

      <Card>
        <CardBody className="px-8 py-6">
          <h2 className="text-2xl font-bold mb-6">New Entry</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              
              <Select
                label="Project you are currently working on"
                value={newEntry.project}
                onChange={e => setNewEntry({ ...newEntry, project: e.target.value })}
                isRequired
              >
                {PROJECT_OPTIONS.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </Select>

              <Input
                type="number"
                label="Expected weeks until completion"
                min={1}
                value={newEntry.completion_weeks.toString()}
                onChange={e => setNewEntry({ ...newEntry, completion_weeks: parseInt(e.target.value) })}
                isRequired
              />

              <Textarea
                label="Biggest learnings last week"
                value={newEntry.learnings}
                onChange={e => setNewEntry({ ...newEntry, learnings: e.target.value })}
                minRows={4}
              />

              <Textarea
                label="Biggest obstacles last week"
                value={newEntry.obstacles}
                onChange={e => setNewEntry({ ...newEntry, obstacles: e.target.value })}
                minRows={4}
              />

              <div className="space-y-4">
                <label className="block text-sm font-bold">
                  Your goals for next week
                </label>
                {newEntry.goals.map((goal, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="text"
                      value={goal.title}
                      onChange={e => {
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
                  onClick={() => setNewEntry({
                    ...newEntry,
                    goals: [...newEntry.goals, { title: '', completed: false }]
                  })}
                >
                  Add Goal
                </Button>
              </div>

              <div>
                <Button
                  type="submit"
                  color="success"
                  size="lg"
                >
                  Create Entry
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
