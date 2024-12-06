"use client";

import React, { useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { Clock, Plus } from 'lucide-react';
import NewTaskDialog from './NewTaskDialog';

const BoardView = () => {
  const { tasks, groups, toggleTask } = useTodo();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [selectedGroupForNewTask, setSelectedGroupForNewTask] = useState<string | null>(null);

  const handleAddTask = (groupId: string) => {
    setSelectedGroupForNewTask(groupId);
    setIsNewTaskOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {groups.map((group) => {
          const groupTasks = tasks.filter((task) => task.groupId === group.id);
          
          return (
            <div 
              key={group.id} 
              className="flex-shrink-0 w-[300px] bg-gray-50 rounded-lg p-4"
            >
              {/* 分组标题 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${group.color}`} />
                  <h3 className="font-medium">{group.name}</h3>
                  <span className="text-sm text-gray-500">
                    ({groupTasks.length})
                  </span>
                </div>
                <button 
                  onClick={() => handleAddTask(group.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* 任务列表 */}
              <div className="space-y-3">
                {groupTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-3 rounded-lg shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-4 h-4 border-2 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs text-white rounded-full ${task.tag.color}`}>
                            {task.tag.name}
                          </span>
                          <div className="flex items-center text-gray-400 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{task.points}</span>
                            <span className="mx-1">·</span>
                            <span>{task.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 空状态 */}
                {groupTasks.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    暂无任务
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <NewTaskDialog 
        open={isNewTaskOpen} 
        onOpenChange={setIsNewTaskOpen}
        initialGroupId={selectedGroupForNewTask}
      />
    </div>
  );
};

export default BoardView;
