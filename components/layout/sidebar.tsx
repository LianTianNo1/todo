"use client";

import React, { useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { ChevronDown, ChevronRight, Plus, Trash2, Calendar, Inbox, X, BarChart2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import AnalyticsView from '../todo/analytics/AnalyticsView';

const Sidebar = () => {
  const { groups, selectedGroupId, selectGroup, toggleGroupExpanded, addGroup, deleteGroup, getGroupProgress } = useTodo();
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('bg-[#5252FF]');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const colors = [
    'bg-[#5252FF]',
    'bg-[#FF7452]',
    'bg-[#00C781]',
    'bg-[#FFCA58]',
    'bg-[#FF4F56]',
    'bg-[#7B61FF]',
    'bg-[#00739D]',
    'bg-[#00873D]',
  ];

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName, newGroupColor);
      setNewGroupName('');
      setShowNewGroup(false);
    }
  };

  return (
    <div className="w-[220px] h-full border-r bg-white p-4">
      {/* <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div>
          <div className="font-medium">我的空间</div>
          <div className="text-sm text-gray-500">个人</div>
        </div>
      </div> */}

      <div className="space-y-1 mb-6">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#5252FF] bg-[rgba(82,82,255,0.1)] rounded-lg">
          <Inbox className="w-4 h-4" />
          待办事项
        </button>
        <button 
          onClick={() => setShowAnalytics(true)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <BarChart2 className="w-4 h-4" />
          数据分析
        </button>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium">任务进度</span>
          <button
            onClick={() => setShowNewGroup(true)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          {groups.map((group) => (
            <div key={group.id} className="px-3">
              <div
                onClick={() => selectGroup(group.id)}
                className={`w-full flex items-center justify-between p-2 text-sm rounded-lg cursor-pointer ${
                  selectedGroupId === group.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroupExpanded(group.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {group.expanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button> */}
                  <span className={`w-2 h-2 rounded-full ${group.color}`} />
                  <span>{group.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{getGroupProgress(group.id)}%</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGroup(group.id);
                    }}
                    className="opacity-50 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog.Root open={showNewGroup} onOpenChange={setShowNewGroup}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">新建分组</Dialog.Title>
              <Dialog.Close className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">分组名称</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">分组颜色</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewGroupColor(color)}
                    className={`w-6 h-6 rounded-full ${color} ${
                      newGroupColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewGroup(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddGroup}
                className="px-4 py-2 text-sm bg-[#5252FF] text-white rounded-lg"
                disabled={!newGroupName.trim()}
              >
                创建
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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
    </div>
  );
};

export default Sidebar;
