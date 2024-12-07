"use client";

import React from 'react';
import dayjs from 'dayjs';
import { Task } from '@/contexts/TodoContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface WeekViewProps {
  currentDate: dayjs.Dayjs;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskMove?: (taskId: string, date: string, hour: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  tasks,
  onTaskClick,
  onTaskMove,
}) => {
  // 生成当前周的时间格子
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  // 获取当前周的日期
  const getWeekDays = () => {
    const days = [];
    let weekStart = currentDate.startOf('week');
    for (let i = 0; i < 7; i++) {
      days.push(weekStart);
      weekStart = weekStart.add(1, 'day');
    }
    return days;
  };

  // 获取某个时间段的任务
  const getTasksForTimeSlot = (date: dayjs.Dayjs, hour: number) => {
    return tasks.filter(task => {
      if (!task.date) return false;
      const taskDate = dayjs(task.date);
      return taskDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD') && 
             taskDate.hour() === hour;
    });
  };

  // 处理拖拽结束
  const handleDragEnd = (result: any) => {
    if (!result.destination || !onTaskMove) return;

    const { draggableId, destination } = result;
    // 修复日期解析，使用最后一个 '-' 来分割日期和小时
    const lastDashIndex = destination.droppableId.lastIndexOf('-');
    const dateStr = destination.droppableId.substring(0, lastDashIndex);
    const hourStr = destination.droppableId.substring(lastDashIndex + 1);

    // Debug logs
    console.log('Drop info:', {
      currentDate: currentDate.format('YYYY-MM-DD'),
      droppableId: destination.droppableId,
      dateStr,
      hourStr,
      parsedDate: dayjs(dateStr).format('YYYY-MM-DD')
    });

    onTaskMove(draggableId, dateStr, parseInt(hourStr));
  };

  const weekDays = getWeekDays();
  const timeSlots = generateTimeSlots();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col">
        {/* 星期头部 */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 border-r text-gray-500 text-sm">时间</div>
          {weekDays.map((day, index) => (
            <div
              key={day.format('YYYY-MM-DD')}
              className={`p-4 border-r text-center ${
                day.isSame(dayjs(), 'day') ? 'bg-blue-50' : ''
              }`}
            >
              <div className="text-sm text-gray-500">
                {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][index]}
              </div>
              <div className={`text-lg font-medium ${
                day.isSame(dayjs(), 'day') ? 'text-blue-600' : ''
              }`}>
                {day.format('DD')}
              </div>
            </div>
          ))}
        </div>

        {/* 时间格子 */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8">
            {/* 时间轴 */}
            <div className="border-r">
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="h-20 border-b p-2 text-sm text-gray-500"
                >
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            {/* 每天的时间格子 */}
            {weekDays.map((day) => (
              <div key={day.format('YYYY-MM-DD')} className="border-r">
                {timeSlots.map((hour) => {
                  const slotTasks = getTasksForTimeSlot(day, hour);
                  return (
                    <Droppable
                      key={`${day.format('YYYY-MM-DD')}-${hour}`}
                      droppableId={`${day.format('YYYY-MM-DD')}-${hour}`}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`h-20 border-b p-1 relative group ${
                            snapshot.isDraggingOver ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="absolute inset-x-1 top-1 space-y-1 max-h-[72px] overflow-y-auto">
                            {slotTasks.map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onTaskClick?.(task);
                                    }}
                                    className={`
                                      text-xs p-1 rounded cursor-move
                                      ${task.tag.color.replace('bg-', '')} bg-opacity-10
                                      hover:bg-opacity-20 
                                      flex items-center gap-1
                                      ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}
                                      transition-all duration-200
                                      select-none
                                    `}
                                  >
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.tag.color}`} />
                                    <span className="truncate flex-1">{task.title}</span>
                                    <span className="text-[10px] text-gray-500 flex-shrink-0">{task.time}分</span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                          {provided.placeholder}
                          {slotTasks.length === 0 && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-50/20 transition-opacity" />
                          )}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WeekView;
