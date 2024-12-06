"use client";

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useTodo } from '@/contexts/TodoContext';
import NewTaskDialog from './NewTaskDialog';
import BoardView from './BoardView';

const TodoList = () => {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'board' | 'timeline' | 'calendar'>('list');
  const { tasks, toggleTask, selectedGroupId } = useTodo();
  const today = format(new Date(), 'dd MMMM');

  // 根据选中的分组过滤任务
  const filteredTasks = selectedGroupId
    ? tasks.filter(task => task.groupId === selectedGroupId)
    : tasks;

  return (
    <div className="p-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Today, {today}</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentView('list')}
              className={`px-4 py-1 text-sm rounded-full ${
                currentView === 'list' 
                  ? 'bg-[rgba(82,82,255,0.1)] text-[#5252FF]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              列表
            </button>
            <button 
              onClick={() => setCurrentView('board')}
              className={`px-4 py-1 text-sm rounded-full ${
                currentView === 'board' 
                  ? 'bg-[rgba(82,82,255,0.1)] text-[#5252FF]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              面板
            </button>
            <button 
              onClick={() => setCurrentView('timeline')}
              className={`px-4 py-1 text-sm rounded-full ${
                currentView === 'timeline' 
                  ? 'bg-[rgba(82,82,255,0.1)] text-[#5252FF]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              时间线
            </button>
            <button 
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-1 text-sm rounded-full ${
                currentView === 'calendar' 
                  ? 'bg-[rgba(82,82,255,0.1)] text-[#5252FF]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              日历
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="px-4 py-2 bg-[#5252FF] text-white rounded-lg text-sm"
        >
          新任务
        </button>
      </div>

      {/* 视图内容 */}
      {currentView === 'list' && (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center h-14 px-4 border rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-[18px] h-[18px] border-2 rounded cursor-pointer"
              />
              <span className={`ml-3 flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </span>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-xs text-white rounded-full ${task.tag.color}`}>
                  {task.tag.name}
                </span>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-xs">{task.points}</span>
                  <span className="mx-1 text-xs">·</span>
                  <span className="text-xs">{task.time}</span>
                  <span className="mx-1 text-xs">·</span>
                  <span className="text-xs">{task.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentView === 'board' && <BoardView />}

      {currentView === 'timeline' && (
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          时间线视图开发中...
        </div>
      )}

      {currentView === 'calendar' && (
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          日历视图开发中...
        </div>
      )}

      <NewTaskDialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen} />
    </div>
  );
};

export default TodoList;
