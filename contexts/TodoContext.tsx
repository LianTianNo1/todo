"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import dayjs from 'dayjs'; // Import dayjs library

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TaskGroup {
  id: string;
  name: string;
  color: string;
  expanded?: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  tag: Tag;
  groupId: string;
  date: string;    // ISO 格式的时间戳
  time: number;    // 预计时间（分钟）
  points: number;  // 任务积分
}

interface TodoContextType {
  tasks: Task[];
  tags: Tag[];
  groups: TaskGroup[];
  selectedGroupId: string;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addTag: (name: string, color: string) => void;
  deleteTag: (id: string) => void;
  addGroup: (name: string, color: string) => void;
  deleteGroup: (id: string) => void;
  selectGroup: (id: string) => void;
  toggleGroupExpanded: (id: string) => void;
  getGroupProgress: (groupId: string) => number;
  updateTask: (updatedTask: Task) => void;
  updateTaskTime: (taskId: string, date: string) => void;
}

const defaultTags: Tag[] = [
  { id: '1', name: '开发', color: 'bg-[#5252FF]' },
  { id: '2', name: '会议', color: 'bg-[#FF7452]' },
  { id: '3', name: '休息', color: 'bg-[#00C781]' },
];

const defaultGroups: TaskGroup[] = [
  { id: '1', name: '调试', color: 'bg-[#5252FF]', expanded: true },
  { id: '2', name: '编码', color: 'bg-[#FF7452]', expanded: true },
  { id: '3', name: '设计', color: 'bg-[#00C781]', expanded: true },
];

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  TASKS: 'todo-tasks',
  TAGS: 'todo-tags',
  GROUPS: 'todo-groups',
  SELECTED_GROUP: 'todo-selected-group'
};

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('1');

  // 初始化时从localStorage加载数据
  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS);
    const storedTags = localStorage.getItem(LOCAL_STORAGE_KEYS.TAGS);
    const storedGroups = localStorage.getItem(LOCAL_STORAGE_KEYS.GROUPS);
    const storedSelectedGroup = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_GROUP);
    
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    
    if (storedTags) {
      setTags(JSON.parse(storedTags));
    } else {
      setTags(defaultTags);
    }

    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    } else {
      setGroups(defaultGroups);
    }

    if (storedSelectedGroup) {
      setSelectedGroupId(storedSelectedGroup);
    }
  }, []);

  // 当数据变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TAGS, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_GROUP, selectedGroupId);
  }, [selectedGroupId]);

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
    // 保存到本地存储
    const updatedTasks = [...tasks, task];
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks));
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
    const tagHasTasks = tasks.some(task => task.tag.id === id);
    if (tagHasTasks) {
      alert('该标签下还有任务，无法删除');
      return;
    }
    setTags(prevTags => prevTags.filter(tag => tag.id !== id));
  };

  const addGroup = (name: string, color: string) => {
    const newGroup: TaskGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color,
      expanded: true
    };
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };

  const deleteGroup = (id: string) => {
    const groupHasTasks = tasks.some(task => task.groupId === id);
    if (groupHasTasks) {
      alert('该分组下还有任务，无法删除');
      return;
    }
    setGroups(prevGroups => prevGroups.filter(group => group.id !== id));
  };

  const selectGroup = (id: string) => {
    setSelectedGroupId(id);
  };

  const toggleGroupExpanded = (id: string) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === id ? { ...group, expanded: !group.expanded } : group
      )
    );
  };

  const getGroupProgress = (groupId: string) => {
    const groupTasks = tasks.filter(task => task.groupId === groupId);
    if (groupTasks.length === 0) return 0;
    const completedTasks = groupTasks.filter(task => task.completed);
    return Math.round((completedTasks.length / groupTasks.length) * 100);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
    // 保存到本地存储
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks));
  };

  const updateTaskTime = (taskId: string, date: string) => {
    try {
      // 验证日期格式
      const validDate = dayjs(date);
      if (!validDate.isValid()) {
        throw new Error('Invalid date format');
      }

      console.log('Updating task time:', {
        taskId,
        date,
        parsedDate: validDate.format('YYYY-MM-DD HH:mm:ss')
      });

      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === taskId
            ? { ...task, date: validDate.format('YYYY-MM-DD HH:mm:ss') }
            : task
        );

        // 保存前验证所有任务的日期
        const validTasks = updatedTasks.every(task => dayjs(task.date).isValid());
        if (!validTasks) {
          throw new Error('Invalid task dates detected');
        }

        localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error updating task time:', error);
    }
  };

  return (
    <TodoContext.Provider value={{
      tasks,
      tags,
      groups,
      selectedGroupId,
      addTask,
      toggleTask,
      deleteTask,
      addTag,
      deleteTag,
      addGroup,
      deleteGroup,
      selectGroup,
      toggleGroupExpanded,
      getGroupProgress,
      updateTask,
      updateTaskTime,
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
