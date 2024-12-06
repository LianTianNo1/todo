"use client";

import React from 'react';
import { Task, TaskGroup } from '@/contexts/TodoContext';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 设置 dayjs 使用中文
dayjs.locale('zh-cn');

interface TimelineItemProps {
  task: Task;
  group?: TaskGroup;
  layout: 'vertical' | 'alternating';
  isCompact: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ task, group, layout, isCompact }) => {
  const side = layout === 'alternating' ? 'left' : 'right';
  
  // 格式化日期和时间
  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return dayjs().format('YYYY年MM月DD日 HH:mm');
    try {
      return dayjs(dateString).format('YYYY年MM月DD日 HH:mm');
    } catch {
      return dayjs().format('YYYY年MM月DD日 HH:mm');
    }
  };

  return (
    <div className={`relative flex items-start gap-4 ${
      layout === 'alternating' ? 'even:flex-row-reverse' : ''
    }`}>
      {/* 时间线和时间 */}
      <div className="flex flex-col items-center min-w-[120px]">
        <div className="text-sm text-gray-500 mb-2">
          {formatDateTime(task.date)}
        </div>
        <div className="w-3 h-3 rounded-full bg-[#5252FF] relative">
          {/* 任务状态指示器 */}
          {task.completed && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
          )}
        </div>
        <div className="w-0.5 h-full bg-gray-200 absolute top-10" />
      </div>

      {/* 内容卡片 */}
      <div className={`flex-1 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 mb-6 ${
        isCompact ? 'py-3' : 'py-4'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded-full text-white text-xs ${task.tag.color}`}>
                {task.tag.name}
              </span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{group?.name}</span>
            </div>
          </div>
          <span className={`text-sm ${task.completed ? 'text-green-500' : 'text-blue-500'}`}>
            {task.completed ? '已完成' : '进行中'}
          </span>
        </div>
        
        {!isCompact && task && (
          <div className="mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>预计时间: {task.time}分钟</span>
              <span>积分: {task.points}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CustomTimelineProps {
  tasks: Task[];
  groups: TaskGroup[];
  layout: 'vertical' | 'alternating';
  isCompact: boolean;
}

const CustomTimeline: React.FC<CustomTimelineProps> = ({ 
  tasks, 
  groups, 
  layout = 'vertical',
  isCompact = false
}) => {
  // 按时间排序任务
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = a.date ? dayjs(a.date).unix() : 0;
    const dateB = b.date ? dayjs(b.date).unix() : 0;
    return dateB - dateA; // 降序排列，最新的在前面
  });

  return (
    <div className="relative px-4">
      {sortedTasks.map((task) => (
        <TimelineItem
          key={task.id}
          task={task}
          group={groups.find(g => g.id === task.groupId)}
          layout={layout}
          isCompact={isCompact}
        />
      ))}
    </div>
  );
};

export default CustomTimeline;
