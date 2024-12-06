"use client";

import React, { createContext, useContext, useState } from 'react';

type Locale = 'zh' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    'today': '今天',
    'newTask': '新建任务',
    'taskTitle': '任务标题',
    'tags': '标签',
    'addTag': '添加标签',
    'tagName': '标签名称',
    'tagColor': '标签颜色',
    'cancel': '取消',
    'create': '创建',
    'list': '列表',
    'board': '看板',
    'timeline': '时间线',
    'calendar': '日历',
    'mySpace': '我的空间',
    'general': '常规',
    'todo': '待办事项',
    'inbox': '收件箱',
    'trash': '回收站',
    'taskProgress': '任务进度',
    'debug': '调试',
    'coding': '编码',
    'design': '设计',
  },
  en: {
    'today': 'Today',
    'newTask': 'New Task',
    'taskTitle': 'Task Title',
    'tags': 'Tags',
    'addTag': 'Add Tag',
    'tagName': 'Tag Name',
    'tagColor': 'Tag Color',
    'cancel': 'Cancel',
    'create': 'Create',
    'list': 'List',
    'board': 'Board',
    'timeline': 'Timeline',
    'calendar': 'Calendar',
    'mySpace': 'My Space',
    'general': 'General',
    'todo': 'Todo',
    'inbox': 'Inbox',
    'trash': 'Trash',
    'taskProgress': 'Task Progress',
    'debug': 'Debug',
    'coding': 'Coding',
    'design': 'Design',
  }
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh');

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
