"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  tag: Tag;
  points: number;
  time: number;
  date: string;
}

interface TodoContextType {
  tasks: Task[];
  tags: Tag[];
  addTask: (title: string, tag: Tag) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addTag: (name: string, color: string) => void;
  deleteTag: (id: string) => void;
}

const defaultTags: Tag[] = [
  { id: '1', name: '开发', color: 'bg-[#5252FF]' },
  { id: '2', name: '会议', color: 'bg-[#FF7452]' },
  { id: '3', name: '休息', color: 'bg-[#FFC300]' },
];

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  TASKS: 'todo-tasks',
  TAGS: 'todo-tags',
};

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // 初始化时从localStorage加载数据
  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS);
    const storedTags = localStorage.getItem(LOCAL_STORAGE_KEYS.TAGS);
    
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    
    if (storedTags) {
      setTags(JSON.parse(storedTags));
    } else {
      setTags(defaultTags); // 如果没有存储的标签，使用默认标签
    }
  }, []);

  // 当数据变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TAGS, JSON.stringify(tags));
  }, [tags]);

  const addTask = (title: string, tag: Tag) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      tag,
      points: 4,
      time: 12,
      date: format(new Date(), 'dd MMM yyyy', { locale: zhCN })
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const addTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color
    };
    setTags(prevTags => [...prevTags, newTag]);
  };

  const deleteTag = (id: string) => {
    // 不允许删除有关联任务的标签
    const tagHasTasks = tasks.some(task => task.tag.id === id);
    if (tagHasTasks) {
      alert('该标签下还有任务，无法删除');
      return;
    }
    setTags(prevTags => prevTags.filter(tag => tag.id !== id));
  };

  return (
    <TodoContext.Provider value={{
      tasks,
      tags,
      addTask,
      toggleTask,
      deleteTask,
      addTag,
      deleteTag
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
