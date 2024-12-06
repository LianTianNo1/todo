"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Inbox, 
  Calendar, 
  Trash2,
  ChevronDown
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col">
      {/* 用户信息区 */}
      <div className="h-16 px-4 flex items-center border-b">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="ml-3">
          <h3 className="text-sm font-medium">我的空间</h3>
        </div>
      </div>

      {/* 主导航 */}
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-lg bg-[rgba(82,82,255,0.1)] text-[#5252FF]">
            <CheckSquare className="w-5 h-5 mr-3" />
            待办事项
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
            <Calendar className="w-5 h-5 mr-3" />
            日历
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
            <Trash2 className="w-5 h-5 mr-3" />
            回收站
          </a>
        </div>

        {/* 任务进度区 */}
        <div className="mt-8">
          <div className="px-3 mb-2">
            <h3 className="flex items-center justify-between text-sm font-medium text-gray-600">
              任务进度
              <ChevronDown className="w-4 h-4" />
            </h3>
          </div>
          <div className="space-y-1">
            <div className="px-3 py-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>调试</span>
                <span className="text-xs text-gray-500">70%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full">
                <div className="h-full w-[70%] bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="px-3 py-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>编码</span>
                <span className="text-xs text-gray-500">45%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full">
                <div className="h-full w-[45%] bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="px-3 py-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>设计</span>
                <span className="text-xs text-gray-500">90%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full">
                <div className="h-full w-[90%] bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
