"use client";

import { getDiaries } from '@/api/missionboard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@heroui/react";
import { format } from 'date-fns';
import { Card, CardBody, CardHeader, Divider, Checkbox, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { ApexOptions } from 'apexcharts';
import { Session } from "@/auth/models";
import dynamic from 'next/dynamic';


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

// Import ApexCharts dynamically to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DiaryOverview({ session }: DiaryOverviewProps) {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasEntryThisWeek, setHasEntryThisWeek] = useState(false);
  const router = useRouter();

  const isAdmin = session?.user?.scopes.includes('diary.admin');

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
        // throw new Error("test");
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
        const diaries = [
          {
            "name": "accounts/83f11e35-a97e-4c21-bf9a-716a6f853889/diaries/2024-W04",
            "account_id": "83f11e35-a97e-4c21-bf9a-716a6f853889",
            "entry_date": "2024-01-26",
            "project": "printf",
            "weeks_till_completion": 3,
            "motivation": 8,
            "learnings": "Learned about memory management and string manipulation in C",
            "obstacles": "Struggling with proper memory allocation in ft_split",
            "create_time": "2024-01-20T17:13:01.521966Z",
            "update_time": "2024-01-20T17:13:01.521966Z",
            "goals": [
              {
                "title": "Complete ft_split implementation",
                "completed": false
              },
              {
                "title": "Write tests for string functions",
                "completed": true
              }
            ]
          },
          {
            "name": "accounts/83f11e35-a97e-4c21-bf9a-716a6f853889/diaries/2024-W03",
            "account_id": "83f11e35-a97e-4c21-bf9a-716a6f853889",
            "entry_date": "2024-01-19",
            "project": "printf",
            "weeks_till_completion": 4,
            "motivation": 9,
            "learnings": "Getting comfortable with pointers and memory allocation",
            "obstacles": "Understanding linked list implementation",
            "create_time": "2024-01-13T17:13:19.156775Z",
            "update_time": "2024-01-13T17:13:19.156775Z",
            "goals": [
              {
                "title": "Implement basic string functions",
                "completed": true
              },
              {
                "title": "Start working on memory functions",
                "completed": true
              }
            ]
          },
          {
            "name": "accounts/83f11e35-a97e-4c21-bf9a-716a6f853889/diaries/2024-W02",
            "account_id": "83f11e35-a97e-4c21-bf9a-716a6f853889",
            "entry_date": "2024-01-12",
            "project": "printf",
            "weeks_till_completion": 5,
            "motivation": 7,
            "learnings": "Started learning C programming fundamentals",
            "obstacles": "Adjusting to low-level programming concepts",
            "create_time": "2024-01-06T17:13:09.835782Z",
            "update_time": "2024-01-06T17:13:09.835782Z",
            "goals": [
              {
                "title": "Set up development environment",
                "completed": true
              },
              {
                "title": "Complete first 5 functions",
                "completed": true
              }
            ]
          },
          {
            "name": "accounts/83f11e35-a97e-4c21-bf9a-716a6f853889/diaries/2024-W01",
            "account_id": "83f11e35-a97e-4c21-bf9a-716a6f853889",
            "entry_date": "2024-01-05",
            "project": "libft",
            "weeks_till_completion": 1,
            "motivation": 9,
            "learnings": "Completed final libft exercises",
            "obstacles": "Time management with multiple assignments",
            "create_time": "2023-12-30T17:13:24.462219Z",
            "update_time": "2023-12-30T17:13:24.462219Z",
            "goals": [
              {
                "title": "Complete BSQ project",
                "completed": true
              },
              {
                "title": "Prepare for final exam",
                "completed": true
              }
            ]
          },
          {
            "name": "accounts/83f11e35-a97e-4c21-bf9a-716a6f853889/diaries/2023-W52",
            "account_id": "83f11e35-a97e-4c21-bf9a-716a6f853889",
            "entry_date": "2023-12-29",
            "project": "libft",
            "weeks_till_completion": 2,
            "motivation": 8,
            "learnings": "Advanced C concepts and group projects",
            "obstacles": "Complex pointer arithmetic in C",
            "create_time": "2023-12-23T17:13:24.462219Z",
            "update_time": "2023-12-23T17:13:24.462219Z",
            "goals": [
              {
                "title": "Complete rush01 project",
                "completed": true
              },
              {
                "title": "Study for C09",
                "completed": true
              }
            ]
          },
          {
            "name": "accounts/83f11e35-a97e-4c21-bf9a-716a6f853889/diaries/2023-W51",
            "account_id": "83f11e35-a97e-4c21-bf9a-716a6f853889",
            "entry_date": "2023-12-22",
            "project": "libft",
            "weeks_till_completion": 3,
            "motivation": 6,
            "learnings": "Shell scripting and basic C programming",
            "obstacles": "Challenging rush00 weekend project",
            "create_time": "2023-12-16T17:13:24.462219Z",
            "update_time": "2023-12-16T17:13:24.462219Z",
            "goals": [
              {
                "title": "Complete Shell01",
                "completed": true
              },
              {
                "title": "Start C03 exercises",
                "completed": false
              }
            ]
          }
        ];
        const sortedDiaries = diaries.sort((a, b) => 
          new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
        );
        setDiaries(sortedDiaries);
        // setError('Failed to fetch diaries');
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

  const handleGoalChange = (diaryId: string, goalIndex: number, checked: boolean) => {
    const updatedDiaries = diaries.map(diary => {
      if (diary.name === diaryId) {
        const updatedDiary = {
          ...diary,
          goals: diary.goals.map((goal, idx) => 
            idx === goalIndex ? { ...goal, completed: checked } : goal
          )
        };
        console.log('Updated diary:', updatedDiary);
        return updatedDiary;
      }
      return diary;
    });
    setDiaries(updatedDiaries);
  };

  // Helper function to find project change points
  const getProjectChangePoints = () => {
    const points: number[] = [];
    diaries.forEach((diary, index) => {
      if (index === 0) {
        points.push(index);
      }
      if (index > 0 && diary.project !== diaries[index - 1].project) {
        points.push(index);
      }
    });
    return points;
  };

  const baseChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'straight',
      width: 5
    },
    xaxis: {
      type: 'datetime',
      categories: diaries.map(diary => diary.entry_date),
      labels: {
        style: {
          colors: '#666'
        }
      }
    },
    markers: {
      size: 6,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      },
    },
    annotations: {
      xaxis: getProjectChangePoints().map(index => ({
        x: new Date(diaries[index].entry_date).getTime(),
        strokeDashArray: 2,
        borderColor: '#FF4E4E',
        label: {
          borderColor: '#FF4E4E',
          style: {
            color: '#fff',
            background: '#FF4E4E',
          },
          text: `${diaries[index].project}`,
          position: 'top',
          orientation: 'horizontal',
          offsetY: -15
        }
      }))
    },
    tooltip: {
      theme: 'dark',
      shared: true,
      intersect: false,
      style: {
        fontSize: '12px'
      },
      marker: {
        show: true
      }
    }
  };

  const motivationChartOptions: ApexOptions = {
    ...baseChartOptions,
    colors: ['#006FEE'],
    yaxis: {
      min: 0,
      max: 10,
      tickAmount: 5,
      title: {
        text: 'Motivation'
      }
    },
    tooltip: {
      ...baseChartOptions.tooltip,
      y: {
        formatter: (value: number) => `${value}/10`
      }
    }
  };

  const weeksChartOptions: ApexOptions = {
    ...baseChartOptions,
    colors: ['#17C964'],
    yaxis: {
      min: 0,
      title: {
        text: 'Weeks till completion'
      }
    },
    tooltip: {
      ...baseChartOptions.tooltip,
      y: {
        formatter: (value: number) => `${value} weeks`
      }
    }
  };

  const motivationSeries = [{
    name: 'Motivation',
    data: diaries.map(diary => diary.motivation)
  }];

  const weeksSeries = [{
    name: 'Weeks till completion',
    data: diaries.map(diary => diary.weeks_till_completion)
  }];

  const completionSeries = [{
    name: 'Tasks Completed',
    data: diaries.map(diary => {
      if (diary.goals.length === 0) return null;
      const completedTasks = diary.goals.filter(goal => goal.completed).length;
      return Math.round((completedTasks / diary.goals.length) * 100);
    })
  }];

  const completionChartOptions: ApexOptions = {
    ...baseChartOptions,
    colors: ['#F5A524'],
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Tasks Completed (%)'
      },
      labels: {
        formatter: (value: number) => `${value}%`
      }
    },
    tooltip: {
      ...baseChartOptions.tooltip,
      y: {
        formatter: (value: number) => `${value}%`
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!session) {
	  // window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}?redirect=${window.location.href}`;
	  return null;
	}
	if (error) return <div>Error: {error}</div>;
	
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="w-full col-span-1 lg:col-span-3 xl:col-span-1">
          <CardHeader>
            <h3 className="text-xl font-bold">Motivation Over Time</h3>
          </CardHeader>
          <CardBody>
            <div className="w-full h-[400px] overflow-hidden">
              <Chart
                options={motivationChartOptions}
                series={motivationSeries}
                type="line"
                height="100%"
              />
            </div>
          </CardBody>
        </Card>

        <Card className="w-full col-span-1 lg:col-span-3 xl:col-span-1">
          <CardHeader>
            <h3 className="text-xl font-bold">Weeks Till Completion</h3>
          </CardHeader>
          <CardBody>
            <div className="w-full h-[400px] overflow-hidden">
              <Chart
                options={weeksChartOptions}
                series={weeksSeries}
                type="line"
                height="100%"
              />
            </div>
          </CardBody>
        </Card>

        <Card className="w-full col-span-1 lg:col-span-3 xl:col-span-1">
          <CardHeader>
            <h3 className="text-xl font-bold">Task Completion Rate</h3>
          </CardHeader>
          <CardBody>
            <div className="w-full h-[400px] overflow-hidden">
              <Chart
                options={completionChartOptions}
                series={completionSeries}
                type="line"
                height="100%"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="space-y-2 max-w-3xl mx-auto">
        {!hasEntryThisWeek && (
          <Card 
            isPressable
            onPress={() => router.push('/entries/new')}
            className="bg-success-50 dark:bg-success-100 w-full"
          >
            <CardBody className="py-2">
              <span className="text-success text-lg font-semibold">
                + Create Entry for This Week
              </span>
            </CardBody>
          </Card>
        )}
        {diaries.toReversed().map((diary) => (
          <Card key={diary.name} className="w-full">
            <CardHeader className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">
                  {format(new Date(diary.entry_date), 'MMM d, yyyy')}
                </h3>
                <span className="text-sm text-default-500">
                  {diary.project}
                </span>
              </div>
              <div className="flex gap-1">
                {isCurrentWeekEntry(diary.entry_date) && (
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    onPress={() => router.push(`/edit/${diary.name}`)}
                  >
                    Edit
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    color="danger"
                    variant="light"
                    size="sm"
                    onPress={() => {
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
            </CardHeader>
            <Divider/>
            <CardBody className="py-2">
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-10 gap-4">
                  <Table 
                    removeWrapper 
                    aria-label="Diary metrics table"
                    hideHeader
                    className="col-span-3"
                  >
                    <TableHeader>
                      <TableColumn>Label</TableColumn>
                      <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold pr-4 w-1/3">Weeks till completion:</TableCell>
                        <TableCell>{diary.weeks_till_completion}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold pr-4">Motivation:</TableCell>
                        <TableCell>{diary.motivation}/10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Table 
                    removeWrapper 
                    aria-label="Diary feedback table"
                    hideHeader
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
                    {diary.goals.slice(0, 2).map((goal, index) => (
                      <Checkbox
                        key={index}
                        isSelected={goal.completed}
                        onValueChange={(checked) => handleGoalChange(diary.name, index, checked)}
                        size="sm"
                        lineThrough={true}
                      >
                        <span className="text-sm break-words">{goal.title}</span>
                      </Checkbox>
                    ))}
                    {diary.goals.length > 2 && (
                      <span className="text-xs text-default-500 pl-7">
                        +{diary.goals.length - 2} more goals
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
