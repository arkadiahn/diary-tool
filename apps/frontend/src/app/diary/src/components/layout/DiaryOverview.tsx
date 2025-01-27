"use client";

import { deleteDiary, Diary, getDiaries, updateDiary } from '@/api/missionboard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@heroui/react";
import { format } from 'date-fns';
import { Card, CardBody, CardHeader, Divider, Checkbox, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { ApexOptions } from 'apexcharts';
import { Session } from "@/auth/models";
import dynamic from 'next/dynamic';
import example_entries from './example_entries.json';
import LoginButton from '../../layout/navbar/loginButton';

interface DiaryOverviewProps {
  session: Session | null;
}

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DiaryOverview({ session }: DiaryOverviewProps) {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExample, setIsExample] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasEntryThisWeek, setHasEntryThisWeek] = useState(false);
  const router = useRouter();
  const isAdmin = session?.user?.scopes.includes('diary.admin');

  useEffect(() => {
    const fetchDiaries = async () => {
      var diaries: Diary[] = [];
      if (!session) {
        console.log("setting example data");
        setIsExample(true);
        setDiaries(example_entries);
        setLoading(false);
        return;
      }
      try {
        diaries = (await getDiaries("me")).data;
        if (diaries.length === 0) {
          setHasEntryThisWeek(false);
          setIsExample(true);
          setDiaries(example_entries);
          setLoading(false);
          return;
        }
        const sortedDiaries = diaries.sort((a, b) => 
          new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
        );
        setDiaries(sortedDiaries);
        const lastEntry = sortedDiaries.at(-1)!;
        const newEntryDate = new Date(lastEntry.entry_date);
        newEntryDate.setDate(newEntryDate.getDate() + 1);
        console.log(newEntryDate)
        console.log(new Date())
        setHasEntryThisWeek(new Date() < newEntryDate);
      } catch {
        setError('Failed to fetch diaries');
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [session]);

  const handleGoalChange = async (diaryId: string, goalIndex: number, checked: boolean) => {
    const updatedDiaries = diaries.map(async diary => {
      if (diary.name === diaryId) {
        const updatedDiary = {
          ...diary,
          goals: diary.goals.map((goal, idx) => 
            idx === goalIndex ? { ...goal, completed: checked } : goal
          )
        };
        const [_, accountID, __, diaryID] = diary.name.split('/');
        await updateDiary(accountID, diaryID, updatedDiary);
        return updatedDiary;
      }
      return diary;
    });
    setDiaries(await Promise.all(updatedDiaries));
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
    data: diaries.map(diary => diary.completion_weeks)
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
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      {error && <div>Error: {error}</div>}
      {isExample && (
        <div className="mb-6">
          {session ? (
            <Card 
              isPressable
              onPress={() => router.push('/new')}
              className="bg-success-50 dark:bg-success-100 w-full"
            >
              <CardBody className="py-2">
                <span className="text-success text-lg font-semibold">
                  + Create Your First Entry
                </span>
              </CardBody>
            </Card>
          ) : (
            <LoginButton />
          )}
          <div className="bg-warning-50 dark:bg-warning-100 p-4 rounded-lg mb-4">
            <p className="text-warning text-lg font-medium mb-2">Example Data</p>
            <p className="text-warning-700 dark:text-warning-200 mt-2">
              The data below shows example entries to help you understand how your diary will look.
            </p>
          </div>
        </div>
      )}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 ${isExample ? 'opacity-60' : ''}`}>
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

      <div className={`space-y-2 max-w-3xl mx-auto ${isExample ? 'opacity-40' : ''}`}>
        {!hasEntryThisWeek && (
          <Card 
            isPressable
            onPress={() => router.push('/new')}
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
                {diary.editable_diary && (
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    onPress={() => router.push(`/new?edit=${diary.name}`)}
                  >
                    Edit
                  </Button>
                )}
                {diary.editable_diary && (
                  <Button
                    color="danger"
                    variant="light"
                    size="sm"
                    onPress={() => {
                      const [_, accountId, __, diaryId] = diary.name.split('/');
                      if (window.confirm('Are you sure you want to delete this entry?')) {
                        deleteDiary(accountId, diaryId);
                        router.refresh();
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
                        <TableCell>{diary.completion_weeks}</TableCell>
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
