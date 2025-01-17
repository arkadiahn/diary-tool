"use client";

import { getAccounts, getAccount, getDiaries, createDiary } from '../../api/missionboard';
import { useState, useEffect } from 'react';
import { Session } from '@arkadia/cnauth';
import { format } from 'date-fns';


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
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        if (session?.user.nickName) {
          const response = await getDiaries(session.user.nickName);
          setDiaries(response.data);
        }
      } catch {
        setError('Failed to fetch diaries');
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!session?.user.nickName) return;
      
      const response = await createDiary(session.user.nickName, {
        ...newEntry,
        goals: newEntry.goals.filter(g => g.title.trim() !== '')
      });

      setDiaries([...diaries, response.data]);
      
      // Reset form
      setNewEntry({
        entry_date: format(new Date(), 'yyyy-MM-dd'),
        project: '',
        weeks_till_completion: 1,
        motivation: 5,
        learnings: '',
        obstacles: '',
        goals: [{ title: '', completed: false }]
      });
    } catch {
      setError('Failed to create diary entry');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!session) return <div>Please login to view your diary</div>;

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
                Date
              </label>
              <input
                type="date"
                value={newEntry.entry_date}
                onChange={e => setNewEntry({...newEntry, entry_date: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Project
              </label>
              <input
                type="text"
                value={newEntry.project}
                onChange={e => setNewEntry({...newEntry, project: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Weeks until completion
              </label>
              <input
                type="number"
                min="1"
                value={newEntry.weeks_till_completion}
                onChange={e => setNewEntry({...newEntry, weeks_till_completion: parseInt(e.target.value)})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Motivation (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={newEntry.motivation}
                onChange={e => setNewEntry({...newEntry, motivation: parseInt(e.target.value)})}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Learnings
              </label>
              <textarea
                value={newEntry.learnings}
                onChange={e => setNewEntry({...newEntry, learnings: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Obstacles
              </label>
              <textarea
                value={newEntry.obstacles}
                onChange={e => setNewEntry({...newEntry, obstacles: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Goals
              </label>
              {newEntry.goals.map((goal, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={goal.title}
                    onChange={e => {
                      const newGoals = [...newEntry.goals];
                      newGoals[index].title = e.target.value;
                      setNewEntry({...newEntry, goals: newGoals});
                    }}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    placeholder="Enter a goal"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newGoals = newEntry.goals.filter((_, i) => i !== index);
                      setNewEntry({...newEntry, goals: newGoals});
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

      {/* Diary Entries List */}
      <div className="space-y-6">
        {diaries.map((diary) => (
          <div key={diary.name} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {new Date(diary.entry_date).toLocaleDateString()}
              </h3>
              <span className="text-gray-600">Project: {diary.project}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-bold">Weeks till completion:</p>
                <p>{diary.weeks_till_completion}</p>
              </div>
              <div>
                <p className="font-bold">Motivation:</p>
                <p>{diary.motivation}/10</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-bold">Learnings:</p>
              <p className="whitespace-pre-wrap">{diary.learnings}</p>
            </div>

            <div className="mb-4">
              <p className="font-bold">Obstacles:</p>
              <p className="whitespace-pre-wrap">{diary.obstacles}</p>
            </div>

            <div>
              <p className="font-bold mb-2">Goals:</p>
              <ul className="list-disc pl-5">
                {diary.goals.map((goal, index) => (
                  <li key={index} className={goal.completed ? 'line-through' : ''}>
                    {goal.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}