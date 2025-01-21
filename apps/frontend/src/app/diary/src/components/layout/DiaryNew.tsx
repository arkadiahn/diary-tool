"use client";

import { getAccounts, getAccount, getDiaries, createDiary } from '@/api/missionboard';
import { useState, useEffect } from 'react';
import { Session } from '@arkadia/cnauth';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';


interface DiaryGoal {
  title: string;
  completed: boolean;
}

interface DiaryEntry {
  name: string;
  account_id: string;
  entry_date: string;
  project: string;
  weeks_till_completion: number;
  motivation: number;
  learnings: string;
  obstacles: string;
  goals: DiaryGoal[];
  create_time: string;
  update_time: string;
}

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

  // const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState({
    entry_date: format(new Date(), 'yyyy-MM-dd'),
    project: '',
    weeks_till_completion: 1,
    motivation: 5,
    learnings: '',
    obstacles: '',
    goals: [{ title: '', completed: false }]
  });

  const router = useRouter();

  useEffect(() => {
    // const fetchDiaries = async () => {
    //   try {
    //     const response = await getDiaries("me");
    //     setDiaries(response.data);
    //   } catch {
    //     setError('Failed to fetch diaries');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchDiaries();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out goals with empty strings before submission
      const filteredGoals = newEntry.goals.filter(g => g.title.trim() !== '');
      await createDiary("me", {
        ...newEntry,
        goals: filteredGoals
      });
      
      // Redirect to overview page after successful submission
      router.push('/');
    } catch (error) {
      console.log(error);
      setError('Failed to create diary entry');
    }
  };

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!session) {
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}?redirect=${window.location.href}`;
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Diary</h1>

      {/* New Entry Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">New Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Project you are currently working on
              </label>
              <select
                value={newEntry.project}
                onChange={e => setNewEntry({ ...newEntry, project: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              >
                <option value="">Select a project</option>
                {PROJECT_OPTIONS.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Expected weeks until completion
              </label>
              <input
                type="number"
                min="1"
                value={newEntry.weeks_till_completion}
                onChange={e => setNewEntry({ ...newEntry, weeks_till_completion: parseInt(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Biggest learnings last week
              </label>
              <textarea
                value={newEntry.learnings}
                onChange={e => setNewEntry({ ...newEntry, learnings: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Biggest obstacles last week
              </label>
              <textarea
                value={newEntry.obstacles}
                onChange={e => setNewEntry({ ...newEntry, obstacles: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Your goals for next week
              </label>
              {newEntry.goals.map((goal, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={goal.title}
                    onChange={e => {
                      const newGoals = [...newEntry.goals];
                      newGoals[index].title = e.target.value;
                      setNewEntry({ ...newEntry, goals: newGoals });
                    }}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    placeholder="Enter a goal"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newGoals = newEntry.goals.filter((_, i) => i !== index);
                      setNewEntry({ ...newEntry, goals: newGoals });
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setNewEntry({
                  ...newEntry,
                  goals: [...newEntry.goals, { title: '', completed: false }]
                })}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Goal
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded font-bold"
              >
                Create Entry
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
