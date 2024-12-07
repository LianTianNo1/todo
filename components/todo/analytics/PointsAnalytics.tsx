import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Task } from '../../../types/todo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 定义配色方案
const colors = {
  primary: '#6366F1', // 主色调：靛蓝色
  secondary: '#A5B4FC', // 次要色：浅靛蓝
  success: '#34D399', // 成功色：绿色
  warning: '#FBBF24', // 警告色：黄色
  error: '#F87171', // 错误色：红色
  background: 'rgba(99, 102, 241, 0.1)', // 背景色：透明靛蓝
};

interface PointsAnalyticsProps {
  tasks: Task[];
}

export const PointsAnalytics: React.FC<PointsAnalyticsProps> = ({ tasks }) => {
  // 计算总积分
  const totalPoints = tasks.reduce((sum, task) => sum + (task.points || 0), 0);
  const completedPoints = tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + (task.points || 0), 0);
  
  // 计算每日积分趋势
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentYear, currentMonth, currentDate - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  // 获取所有已完成的任务
  const completedTasks = tasks.filter(task => task.completed);
  console.log("Completed tasks:", completedTasks);

  // 由于没有完成时间戳，我们把所有完成的任务都算在今天
  const dailyPoints = last7Days.map(date => {
    const isToday = date.getDate() === currentDate && 
                   date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear;

    if (isToday) {
      const points = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0);
      console.log(`Today (${date.toLocaleDateString()}): Found ${completedTasks.length} completed tasks, total ${points} points`);
      return points;
    }
    
    return 0;
  });

  const maxPoints = Math.max(...dailyPoints, 1); // 确保最小值为1，避免空图

  const trendChartData = {
    labels: last7Days.map(date => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}/${day}`;
    }),
    datasets: [
      {
        label: '每日获得积分',
        data: dailyPoints,
        fill: true,
        borderColor: colors.primary,
        backgroundColor: colors.background,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
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
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
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
        cornerRadius: 4,
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
        suggestedMax: maxPoints + 1, // 设置合适的最大值
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 1, // 确保刻度为整数
          callback: function(value) {
            return value + '分';
          }
        }
      },
    },
  };

  // 计算任务难度分布（基于积分）
  const difficultyDistribution = {
    easy: tasks.filter(task => (task.points || 0) <= 2).length,
    medium: tasks.filter(task => (task.points || 0) > 2 && (task.points || 0) <= 5).length,
    hard: tasks.filter(task => (task.points || 0) > 5).length,
  };

  const difficultyChartData = {
    labels: ['简单 (≤2分)', '中等 (3-5分)', '困难 (>5分)'],
    datasets: [
      {
        label: '任务数量',
        data: [
          difficultyDistribution.easy,
          difficultyDistribution.medium,
          difficultyDistribution.hard,
        ],
        backgroundColor: [
          colors.success,
          colors.warning,
          colors.error,
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 积分概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">总积分</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold" style={{ color: colors.primary }}>{totalPoints}</span>
            <span className="ml-2 text-gray-500">分</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">已获得积分</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold" style={{ color: colors.success }}>{completedPoints}</span>
            <span className="ml-2 text-gray-500">分</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">完成率</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold" style={{ color: colors.primary }}>
              {totalPoints ? Math.round((completedPoints / totalPoints) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* 积分趋势图 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">积分获取趋势</h3>
        <div className="h-[300px]">
          <Line data={trendChartData} options={chartOptions} />
        </div>
      </div>

      {/* 任务难度分布 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">任务难度分布</h3>
        <div className="h-[300px]">
          <Bar data={difficultyChartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12,
                  },
                },
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
                cornerRadius: 4,
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
          }} />
        </div>
      </div>
    </div>
  );
};
