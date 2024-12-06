"use client";

import React, { useState, useMemo } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { ChevronDown, ChevronUp, LayoutGrid, AlignJustify, LayoutPanelLeft } from 'lucide-react';
import CustomTimeline from './CustomTimeline';

const TimelineView = () => {
  const { tasks, groups } = useTodo();
  const [selectedGroupId, setSelectedGroupId] = useState<string | 'all'>('all');
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');
  const [layout, setLayout] = useState<'vertical' | 'alternating'>('vertical');
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  // 根据选择的分组过滤任务
  const filteredTasks = useMemo(() => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.date || Date.now());
      const dateB = new Date(b.date || Date.now());
      return dateB.getTime() - dateA.getTime();
    });

    return selectedGroupId === 'all'
      ? sortedTasks
      : sortedTasks.filter(task => task.groupId === selectedGroupId);
  }, [tasks, selectedGroupId]);

  return (
    <div className="p-6">
      {/* 顶部工具栏 */}
      <div className="mb-6 flex items-center justify-between">
        {/* 分组选择 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedGroupId('all')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedGroupId === 'all'
                ? 'bg-[rgba(82,82,255,0.1)] text-[#5252FF]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            全部任务
          </button>
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedGroupId === group.id
                  ? 'bg-[rgba(82,82,255,0.1)] text-[#5252FF]'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>

        {/* 视图控制 */}
        <div className="flex items-center space-x-2">
          {/* 布局切换 */}
          <div className="relative">
            <button
              onClick={() => setShowLayoutMenu(!showLayoutMenu)}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LayoutPanelLeft className="w-4 h-4 mr-2" />
              {layout === 'vertical' ? '垂直布局' : '交错布局'}
              {showLayoutMenu ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>

            {showLayoutMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <button
                  onClick={() => {
                    setLayout('vertical');
                    setShowLayoutMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  垂直布局
                  <span className="text-xs text-gray-500 ml-2">单列显示</span>
                </button>
                <button
                  onClick={() => {
                    setLayout('alternating');
                    setShowLayoutMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  交错布局
                  <span className="text-xs text-gray-500 ml-2">双列显示</span>
                </button>
              </div>
            )}
          </div>

          {/* 密度切换 */}
          <div className="relative">
            <button
              onClick={() => setShowDensityMenu(!showDensityMenu)}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {density === 'compact' ? (
                <LayoutGrid className="w-4 h-4 mr-2" />
              ) : (
                <AlignJustify className="w-4 h-4 mr-2" />
              )}
              {density === 'compact' ? '紧凑视图' : '舒适视图'}
              {showDensityMenu ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>

            {showDensityMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <button
                  onClick={() => {
                    setDensity('comfortable');
                    setShowDensityMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  舒适视图
                  <span className="text-xs text-gray-500 ml-2">显示更多内容</span>
                </button>
                <button
                  onClick={() => {
                    setDensity('compact');
                    setShowDensityMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  紧凑视图
                  <span className="text-xs text-gray-500 ml-2">显示更少内容</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 时间线视图 */}
      <div className="h-[calc(100vh-200px)] overflow-auto">
        {filteredTasks.length > 0 ? (
          <CustomTimeline
            tasks={filteredTasks}
            groups={groups}
            layout={layout}
            isCompact={density === 'compact'}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            暂无任务
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineView;
