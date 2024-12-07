"use client";

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useTodo } from '@/contexts/TodoContext';
import { useLocale } from '@/contexts/LocaleContext';
import dayjs from 'dayjs';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { PointsAnalytics } from './PointsAnalytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const AnalyticsView = () => {
  const { tasks, tags } = useTodo();
  const { t } = useLocale();
  const [tasksByTag, setTasksByTag] = useState<{ [key: string]: number }>({});
  const [tasksByStatus, setTasksByStatus] = useState<{ completed: number; pending: number }>({ completed: 0, pending: 0 });
  const [tasksByDay, setTasksByDay] = useState<{ [key: string]: number }>({});
  const [weeklyChange, setWeeklyChange] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'points'>('overview');

  useEffect(() => {
    // 统计标签任务数量
    const tagStats = tags.reduce((acc, tag) => {
      acc[tag.name] = tasks.filter(task => task.tag.id === tag.id).length;
      return acc;
    }, {} as { [key: string]: number });
    setTasksByTag(tagStats);

    // 统计完成状态
    const statusStats = tasks.reduce(
      (acc, task) => {
        if (task.completed) {
          acc.completed++;
        } else {
          acc.pending++;
        }
        return acc;
      },
      { completed: 0, pending: 0 }
    );
    setTasksByStatus(statusStats);

    // 统计每天的任务数量（最近7天）
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      return dayjs().subtract(i, 'day').format('MM-DD');
    }).reverse();

    const dayStats = last7Days.reduce((acc, date) => {
      acc[date] = tasks.filter(task => 
        dayjs(task.date).format('MM-DD') === date
      ).length;
      return acc;
    }, {} as { [key: string]: number });
    setTasksByDay(dayStats);

    // 计算周同比变化
    const thisWeek = Object.values(dayStats).reduce((a, b) => a + b, 0);
    const lastWeek = tasks.filter(task => {
      const taskDate = dayjs(task.date);
      const daysAgo = dayjs().diff(taskDate, 'day');
      return daysAgo >= 7 && daysAgo < 14;
    }).length;
    setWeeklyChange(lastWeek ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0);
  }, [tasks, tags]);

  // 标签分布图表配置
  const tagChartData = {
    labels: Object.keys(tasksByTag),
    datasets: [
      {
        data: Object.values(tasksByTag),
        backgroundColor: [
          'rgba(82, 82, 255, 0.8)',
          'rgba(255, 82, 82, 0.8)',
          'rgba(82, 255, 82, 0.8)',
          'rgba(255, 255, 82, 0.8)',
          'rgba(255, 82, 255, 0.8)',
          'rgba(82, 255, 255, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // 完成状态图表配置
  const statusChartData = {
    labels: ['已完成', '进行中'],
    datasets: [
      {
        data: [tasksByStatus.completed, tasksByStatus.pending],
        backgroundColor: ['rgba(82, 255, 82, 0.8)', 'rgba(255, 82, 82, 0.8)'],
        borderWidth: 0,
      },
    ],
  };

  // 每日任务趋势图表配置
  const trendChartData = {
    labels: Object.keys(tasksByDay),
    datasets: [
      {
        label: '每日任务数',
        data: Object.values(tasksByDay),
        fill: true,
        borderColor: 'rgba(82, 82, 255, 0.8)',
        backgroundColor: 'rgba(82, 82, 255, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(82, 82, 255, 0.8)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return (
    <div className="p-8 bg-gray-50">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500">总任务</div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#5252FF]" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2">{tasks.length}</div>
          <div className="flex items-center text-sm">
            <span className={`flex items-center ${weeklyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {weeklyChange >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(weeklyChange).toFixed(1)}%
            </span>
            <span className="text-gray-400 ml-2">周同比</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500">完成率</div>
          </div>
          <div className="text-3xl font-bold mb-2">
            {tasks.length ? ((tasksByStatus.completed / tasks.length) * 100).toFixed(1) : 0}%
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-[#5252FF] h-2 rounded-full transition-all duration-500"
              style={{ width: `${tasks.length ? (tasksByStatus.completed / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500">任务分布</div>
          </div>
          <div className="flex items-center gap-4">
            {Object.entries(tasksByTag).map(([tag, count], index) => (
              <div key={tag} className="flex-1">
                <div className="text-sm text-gray-500 mb-1">{tag}</div>
                <div className="text-2xl font-bold mb-2">{count}</div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(count / tasks.length) * 100}%`,
                      backgroundColor: tagChartData.datasets[0].backgroundColor[index],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          总览
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'points'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('points')}
        >
          积分统计
        </button>
      </div>

      {/* 内容区域 */}
      {activeTab === 'overview' ? (
        <>
          {/* 数据概览卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Activity className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold">总任务</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{tasks.length}</span>
                    <span className="text-sm text-gray-500">
                      {weeklyChange >= 0 ? (
                        <span className="flex items-center text-green-500">
                          <ArrowUp className="w-4 h-4" />
                          {weeklyChange}%
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <ArrowDown className="w-4 h-4" />
                          {Math.abs(weeklyChange)}%
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">完成率</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {((tasksByStatus.completed / tasks.length) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">任务分布</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span>开发</span>
                    <span>{tasksByTag['开发'] || 0}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>会议</span>
                    <span>{tasksByTag['会议'] || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>休息</span>
                    <span>{tasksByTag['休息'] || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 gap-6">
            {/* 近7天趋势 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">近7天趋势</h3>
              <div className="h-[400px]">
                <Line data={trendChartData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: true,
                      position: 'top' as const,
                      align: 'end' as const,
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }} />
              </div>
            </div>

            {/* 标签分布 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">标签分布</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 饼图 */}
                <div className="md:col-span-1">
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="w-full max-w-[300px]">
                      <Doughnut 
                        data={tagChartData} 
                        options={{
                          ...chartOptions,
                          cutout: '75%',
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* 标签列表 */}
                <div className="md:col-span-2 flex flex-col justify-center">
                  <div className="space-y-4">
                    {Object.entries(tasksByTag).map(([tag, count], index) => (
                      <div key={tag} className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full" style={{ 
                          backgroundColor: tagChartData.datasets[0].backgroundColor[index] 
                        }} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{tag}</span>
                            <span className="text-gray-500">
                              {count} 个任务 ({((count / tasks.length) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(count / tasks.length) * 100}%`,
                                backgroundColor: tagChartData.datasets[0].backgroundColor[index],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <PointsAnalytics tasks={tasks} />
      )}
    </div>
  );
};

export default AnalyticsView;
