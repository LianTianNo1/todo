"use client";

import React from 'react';
import dayjs from 'dayjs';
import { Task } from '@/contexts/TodoContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DayViewProps {
  currentDate: dayjs.Dayjs;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  tasks,
  onTaskClick,
}) => {
  // 生成时间格子
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  // 获取某个时间段的任务
  const getTasksForTimeSlot = (hour: number) => {
    return tasks.filter(task => {
      const taskDate = dayjs(task.date);
      return taskDate.isSame(currentDate, 'day') && taskDate.hour() === hour;
    });
  };

  const timeSlots = generateTimeSlots();
  const todayTasks = tasks.filter(task => 
    dayjs(task.date).isSame(currentDate, 'day')
  );

  return (
    <div className="h-full grid grid-cols-4 gap-4">
      {/* 左侧时间线视图 */}
      <div className="col-span-3 overflow-y-auto">
        <div className="grid grid-cols-1">
          {timeSlots.map((hour) => {
            const slotTasks = getTasksForTimeSlot(hour);
            return (
              <div
                key={hour}
                className="relative h-20 border-b group hover:bg-gray-50"
              >
                {/* 时间标记 */}
                <div className="absolute -left-16 top-0 w-16 pr-4 text-right text-sm text-gray-500">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>

                {/* 任务内容 */}
                <div className="pl-4 py-1 space-y-1">
                  {slotTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className={`
                        flex items-center gap-2 p-2 rounded cursor-pointer
                        ${task.tag.color.replace('bg-', '')} bg-opacity-10
                        hover:bg-opacity-20
                      `}
                    >
                      <div className={`w-2 h-2 rounded-full ${task.tag.color}`} />
                      <span className="flex-1 text-sm truncate">{task.title}</span>
                      <span className="text-xs text-gray-500">
                        {task.time}分钟
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧任务列表 */}
      <div className="border-l p-4">
        <h3 className="text-lg font-medium mb-4">今日任务</h3>
        <div className="space-y-2">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task)}
              className={`
                p-3 rounded-lg cursor-pointer
                ${task.tag.color.replace('bg-', '')} bg-opacity-10
                hover:bg-opacity-20
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${task.tag.color}`} />
                <span className="text-sm font-medium">{task.title}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{dayjs(task.date).format('HH:mm')}</span>
                <span>{task.time}分钟</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
