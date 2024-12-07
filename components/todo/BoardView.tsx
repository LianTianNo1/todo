"use client";

import React, { useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { Plus, Calendar, Clock, BarChart2, Search, Settings, ChevronDown, ChevronRight, X } from 'lucide-react';
import dayjs from 'dayjs';
import NewTaskDialog from "./NewTaskDialog";
import CalendarView from './calendar/CalendarView';
import AnalyticsView from './analytics/AnalyticsView';

interface DisplaySettings {
  showCompleted: boolean;
  showTime: boolean;
  showPoints: boolean;
  sortBy: 'date' | 'priority' | 'points';
}

const BoardView = () => {
  const { tasks, groups, tags, addTask, toggleTask } = useTodo();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNewTask, setShowNewTask] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [displaySettings, setDisplaySettings] = React.useState<DisplaySettings>(() => {
    // 从 localStorage 读取设置，如果没有则使用默认值
    const savedSettings = localStorage.getItem('todoDisplaySettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      showCompleted: true,
      showTime: true,
      showPoints: true,
      sortBy: 'date'
    };
  });
  // 添加临时设置状态
  const [tempSettings, setTempSettings] = React.useState<DisplaySettings>(displaySettings);

  // 打开设置时，用当前设置初始化临时设置
  const handleOpenSettings = () => {
    setTempSettings(displaySettings);
    setShowSettings(true);
  };

  // 保存设置
  const handleSaveSettings = () => {
    setDisplaySettings(tempSettings);
    localStorage.setItem('todoDisplaySettings', JSON.stringify(tempSettings));
    setShowSettings(false);
  };

  // 取消设置
  const handleCancelSettings = () => {
    setTempSettings(displaySettings); // 恢复到之前的设置
    setShowSettings(false);
  };

  // 计算任务统计数据
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    upcoming: tasks.filter(task => !task.completed && new Date(task.date) > new Date()).length,
    today: tasks.filter(task => {
      const taskDate = dayjs(task.date);
      return taskDate.isSame(dayjs(), 'day');
    }).length
  };

  // 计算完成率
  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  // 按分组统计任务
  const tasksByGroup = groups.map(group => ({
    ...group,
    tasks: tasks.filter(task => task.groupId === group.id)
  }));

  // 根据搜索词过滤任务
  const filterTasks = (tasks: any[]) => {
    if (!searchQuery) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.tag.name.toLowerCase().includes(query) ||
      groups.find(g => g.id === task.groupId)?.name.toLowerCase().includes(query)
    );
  };

  // 处理搜索框变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // 当有搜索内容时自动展开所有分组
    if (e.target.value) {
      const allExpanded = groups.reduce((acc, group) => ({ ...acc, [group.id]: true }), {});
      setExpandedGroups(allExpanded);
    }
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // 保存设置到 localStorage
  React.useEffect(() => {
    localStorage.setItem('todoDisplaySettings', JSON.stringify(displaySettings));
  }, [displaySettings]);

  const handleSettingChange = (setting: keyof Omit<DisplaySettings, 'sortBy'>) => {
    setTempSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTempSettings(prev => ({
      ...prev,
      sortBy: e.target.value as DisplaySettings['sortBy']
    }));
  };

  // 根据设置过滤和排序任务
  const processTasksBySettings = (tasks: any[]) => {
    let processedTasks = [...tasks];
    
    // 过滤已完成任务
    if (!displaySettings.showCompleted) {
      processedTasks = processedTasks.filter(task => !task.completed);
    }

    // 排序
    processedTasks.sort((a, b) => {
      switch (displaySettings.sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'priority':
          return (b.tag.priority || 0) - (a.tag.priority || 0);
        case 'points':
          return (b.points || 0) - (a.points || 0);
        default:
          return 0;
      }
    });

    return processedTasks;
  };

  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() => {
    // 默认展开所有分组
    return groups.reduce((acc, group) => ({ ...acc, [group.id]: true }), {});
  });

  return (
    <>
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* 左侧统计面板 */}
      <div className="col-span-3 space-y-6">
        {/* 任务概览卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">任务概览</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{taskStats.today}</div>
              <div className="text-sm text-gray-600">今日任务</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
              <div className="text-sm text-gray-600">已完成</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{taskStats.upcoming}</div>
              <div className="text-sm text-gray-600">即将到期</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
              <div className="text-sm text-gray-600">完成率</div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">快捷操作</h2>
          <div className="space-y-2">
            <button 
              className="w-full flex items-center gap-2 px-4 py-2 text-sm bg-[#5252FF] text-white rounded-lg hover:bg-blue-600"
              onClick={() => setShowNewTask(true)}
            >
              <Plus className="w-4 h-4" />
              新建任务
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => setShowCalendar(true)}
            >
              <Calendar className="w-4 h-4" />
              查看日历
            </button>
            {/* <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <BarChart2 className="w-4 h-4" />
              数据统计
            </button> */}
          </div>
        </div>
      </div>

      {/* 中间任务列表 */}
      <div className="col-span-6 space-y-6">
        {/* 搜索栏 */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜索任务..."
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button 
            onClick={handleOpenSettings}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="设置"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAnalytics(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="数据分析"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>

        {/* 任务看板 */}
        <div className="space-y-6">
          {tasksByGroup.map(group => {
            const filteredTasks = filterTasks(group.tasks);
            const processedTasks = processTasksBySettings(filteredTasks);
            if (searchQuery && processedTasks.length === 0) return null;
            
            return (
              <div key={group.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleGroup(group.id)}>
                    {expandedGroups[group.id] ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{processedTasks.length} 个任务</span>
                </div>
                {expandedGroups[group.id] && (
                  <div className="space-y-3">
                    {processedTasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={task.completed ? 'line-through text-gray-400' : ''}>
                              {task.title}
                            </span>
                            <span className={`px-2 py-0.5 text-xs text-white rounded-full ${task.tag.color}`}>
                              {task.tag.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            {displaySettings.showTime && (
                              <>
                                <Clock className="w-4 h-4" />
                                <span>{dayjs(task.date).format('MM-DD HH:mm')}</span>
                                <span>·</span>
                                <span>{task.time}分钟</span>
                              </>
                            )}
                            {displaySettings.showPoints && (
                              <>
                                {displaySettings.showTime && <span>·</span>}
                                <span>{task.points}积分</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧数据统计 */}
      <div className="col-span-3 space-y-6">
        {/* 标签统计 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">标签统计</h2>
          <div className="space-y-3">
            {tags.map(tag => {
              const tagTasks = tasks.filter(task => task.tag.id === tag.id);
              const tagCompletedTasks = tagTasks.filter(task => task.completed);
              const tagCompletionRate = tagTasks.length > 0
                ? Math.round((tagCompletedTasks.length / tagTasks.length) * 100)
                : 0;

              return (
                <div key={tag.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{tag.name}</span>
                      <span className="text-gray-500">{tagCompletionRate}%</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${tag.color}`}
                        style={{ width: `${tagCompletionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 待办事项 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">待办事项</h2>
          <div className="space-y-3">
            {tasks
              .filter(task => !task.completed)
              .slice(0, 5)
              .map(task => (
                <div key={task.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.tag.color}`} />
                  <div className="flex-1">
                    <div className="text-sm">{task.title}</div>
                    <div className="text-xs text-gray-500">
                      {dayjs(task.date).format('MM-DD HH:mm')}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
    {/* 设置弹窗 */}
    {showSettings && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-[480px] max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">设置</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* 设置选项 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">显示选项</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={tempSettings.showCompleted}
                      onChange={() => handleSettingChange('showCompleted')}
                    />
                    <span>显示已完成任务</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={tempSettings.showTime}
                      onChange={() => handleSettingChange('showTime')}
                    />
                    <span>显示任务时间</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={tempSettings.showPoints}
                      onChange={() => handleSettingChange('showPoints')}
                    />
                    <span>显示任务积分</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">排序方式</h3>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={tempSettings.sortBy}
                  onChange={handleSortChange}
                >
                  <option value="date">按日期</option>
                  <option value="priority">按优先级</option>
                  <option value="points">按积分</option>
                </select>
              </div>
            </div>

            {/* 按钮 */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelSettings}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-[#5252FF] text-white rounded-lg hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* 数据分析弹窗 */}
    {showAnalytics && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-[90vw] max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">数据分析</h2>
            <button
              onClick={() => setShowAnalytics(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <AnalyticsView />
        </div>
      </div>
    )}
    {/* 日历弹窗 */}
    {showCalendar && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 overflow-hidden">
        <div className="bg-white rounded-xl w-full max-w-[1200px] h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">日历视图</h2>
            <button
              onClick={() => setShowCalendar(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <CalendarView />
          </div>
        </div>
      </div>
    )}
    {/* 新建任务弹窗 */}
    <NewTaskDialog 
      open={showNewTask}
      onOpenChange={setShowNewTask}
    />
    </>
  );
};

export default BoardView;
