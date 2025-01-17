"use client";

import { getDiaries } from '@/api/missionboard';
import { useState, useEffect } from 'react';
import { Session } from '@arkadia/cnauth';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
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

interface DiaryOverviewProps {
  session: Session | null;
}

export default function DiaryOverview({ session }: DiaryOverviewProps) {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasEntryThisWeek, setHasEntryThisWeek] = useState(false);
  const router = useRouter();

  const isAdmin = session?.user?.scopes.includes('admin');

  // Get Sunday of current week
  const getSundayOfCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Days until next Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + diff);
    return sunday.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await getDiaries("me");
        // Sort diaries by entry_date in descending order (newest first)
        const sortedDiaries = response.data.sort((a, b) => 
          new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
        );
        setDiaries(sortedDiaries);
        
        // Check if there's an entry for this week's Sunday
        const thisWeekSunday = getSundayOfCurrentWeek();
        const hasEntry = sortedDiaries.some(diary => diary.entry_date === thisWeekSunday);
        setHasEntryThisWeek(hasEntry);
      } catch {
        setError('Failed to fetch diaries');
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [session]);

  const isCurrentWeekEntry = (entryDate: string) => {
    const sundayOfWeek = getSundayOfCurrentWeek();
    return entryDate === sundayOfWeek;
  };

  if (loading) return <div>Loading...</div>;
  if (!session) {
	  window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}?redirect=${window.location.href}`;
	  return null;
	}
	if (error) return <div>Error: {error}</div>;
	
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Diary Entries</h1>

      <div className="space-y-4 max-w-3xl mx-auto">
        {!hasEntryThisWeek && (
          <div 
            onClick={() => router.push('/new')}
            className="bg-green-100 dark:bg-green-900 shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-center text-green-700 dark:text-green-300 text-lg font-semibold">
              + Create Entry for This Week
            </div>
          </div>
        )}

        {diaries.map((diary) => (
          <div key={diary.name} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold">
                  {format(new Date(diary.entry_date), 'MMM d, yyyy')}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {diary.project}
                </span>
              </div>
              <div className="flex gap-2">
                {isCurrentWeekEntry(diary.entry_date) && (
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    onClick={() => router.push(`/edit/${diary.name}`)}
                  >
                    Edit
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    color="danger"
                    variant="light"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this entry?')) {
                        // TODO: Implement delete functionality
                        console.log('Delete diary:', diary.name);
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Weeks till completion:</p>
                  <p>{diary.weeks_till_completion}</p>
                </div>
                <div>
                  <p className="font-semibold">Motivation:</p>
                  <p>{diary.motivation}/10</p>
                </div>
              </div>

              <div>
                <p className="font-semibold">Goals:</p>
                <ul className="list-disc pl-5">
                  {diary.goals.slice(0, 2).map((goal, index) => (
                    <li key={index} className={goal.completed ? 'line-through' : ''}>
                      {goal.title}
                    </li>
                  ))}
                  {diary.goals.length > 2 && (
                    <li className="text-gray-600 dark:text-gray-400">
                      +{diary.goals.length - 2} more goals
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
