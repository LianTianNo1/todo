"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { useTodo } from '@/contexts/TodoContext';
import { useLocale } from '@/contexts/LocaleContext';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

type ViewMode = 'month' | 'week' | 'day';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const { tasks, updateTaskTime } = useTodo();
  const { t } = useLocale();

  // 导航控制
  const goToToday = () => setCurrentDate(dayjs());
  const goToPrevious = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(prev => prev.subtract(1, 'month'));
        break;
      case 'week':
        setCurrentDate(prev => prev.subtract(1, 'week'));
        break;
      case 'day':
        setCurrentDate(prev => prev.subtract(1, 'day'));
        break;
    }
  };
  const goToNext = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(prev => prev.add(1, 'month'));
        break;
      case 'week':
        setCurrentDate(prev => prev.add(1, 'week'));
        break;
      case 'day':
        setCurrentDate(prev => prev.add(1, 'day'));
        break;
    }
  };

  // 处理任务移动
  const handleTaskMove = (taskId: string, date: string, hour: number) => {
    try {
      // 确保日期格式正确
      const targetDate = dayjs(date);
      if (!targetDate.isValid()) {
        console.error('Invalid date:', date);
        return;
      }

      const finalDate = targetDate
        .hour(hour)
        .minute(0)
        .second(0);
      
      console.log('Moving task', {
        taskId,
        originalDate: date,
        parsedDate: targetDate.format('YYYY-MM-DD'),
        targetHour: hour,
        finalDate: finalDate.format('YYYY-MM-DD HH:mm:ss')
      });

      updateTaskTime(taskId, finalDate.format('YYYY-MM-DD HH:mm:ss'));
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm">
      {/* Calendar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">
            {currentDate.format('YYYY年 MM月')}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              今天
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'month'
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            月
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'week'
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            周
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'day'
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            日
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 p-4">
        {viewMode === 'month' && (
          <MonthView
            currentDate={currentDate}
            tasks={tasks}
            onDayClick={(date) => {
              setCurrentDate(date);
              setViewMode('day');
            }}
          />
        )}
        {viewMode === 'week' && (
          <WeekView
            currentDate={currentDate}
            tasks={tasks}
            onTaskClick={(task) => {
              // TODO: 显示任务详情
              console.log('Task clicked:', task);
            }}
            onTaskMove={handleTaskMove}
          />
        )}
        {viewMode === 'day' && (
          <DayView
            currentDate={currentDate}
            tasks={tasks}
            onTaskClick={(task) => {
              // TODO: 显示任务详情
              console.log('Task clicked:', task);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarView;
