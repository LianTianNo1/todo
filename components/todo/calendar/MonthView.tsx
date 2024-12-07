"use client";

import React from 'react';
import dayjs from 'dayjs';
import { Task } from '@/contexts/TodoContext';

interface MonthViewProps {
  currentDate: dayjs.Dayjs;
  tasks: Task[];
  onDayClick: (date: dayjs.Dayjs) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  tasks,
  onDayClick,
}) => {
  // 生成当月的日历数据
  const generateCalendarDays = () => {
    const firstDayOfMonth = currentDate.startOf('month');
    const lastDayOfMonth = currentDate.endOf('month');
    const startDay = firstDayOfMonth.startOf('week');
    const endDay = lastDayOfMonth.endOf('week');

    const days: dayjs.Dayjs[] = [];
    let day = startDay;

    while (day.isBefore(endDay) || day.isSame(endDay, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  };

  // 获取某一天的任务
  const getDayTasks = (date: dayjs.Dayjs) => {
    return tasks.filter(task => {
      const taskDate = dayjs(task.date);
      return taskDate.isSame(date, 'day');
    });
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="h-full flex flex-col">
      {/* 星期头部 */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 text-sm font-medium
              ${index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历格子 */}
      <div className="flex-1 grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const isToday = day.isSame(dayjs(), 'day');
          const isCurrentMonth = day.isSame(currentDate, 'month');
          const dayTasks = getDayTasks(day);

          return (
            <div
              key={day.format('YYYY-MM-DD')}
              onClick={() => onDayClick(day)}
              className={`
                min-h-[100px] p-1 border rounded
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isToday ? 'border-blue-500' : 'border-gray-200'}
                hover:border-blue-500 cursor-pointer
              `}
            >
              {/* 日期 */}
              <div className={`
                text-right text-sm mb-1
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isToday ? 'font-bold' : ''}
              `}>
                {day.format('D')}
              </div>

              {/* 任务列表 */}
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="text-xs px-1 py-0.5 rounded bg-blue-50 text-blue-600 truncate"
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayTasks.length - 3} 更多
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
