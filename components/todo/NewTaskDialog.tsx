"use client";

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';
import type { Tag, Group } from '@/contexts/TodoContext';
import { useLocale } from '@/contexts/LocaleContext';

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGroupId?: string | null;
}

const NewTaskDialog: React.FC<NewTaskDialogProps> = ({ 
  open, 
  onOpenChange,
  initialGroupId = null
}) => {
  const [title, setTitle] = useState('');
  const { tags, groups, addTask, addTag } = useTodo();
  const { t } = useLocale();
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [selectedGroup, setSelectedGroup] = useState(initialGroupId || groups[0]?.id || '');
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('bg-[#5252FF]');
  const [time, setTime] = useState('30'); // 预计时间（分钟）
  const [points, setPoints] = useState('1'); // 任务积分

  // 当tags改变时，如果没有选中的标签且有可用标签，选择第一个标签
  useEffect(() => {
    if (!selectedTag && tags.length > 0) {
      setSelectedTag(tags[0]);
    }
  }, [tags, selectedTag]);

  useEffect(() => {
    if (initialGroupId) {
      setSelectedGroup(initialGroupId);
    }
  }, [initialGroupId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(title, selectedTag, selectedGroup, '看看-', initialGroupId, groups[0]?.id);
    if (!title || !selectedTag || !selectedGroup) return;

    // const selectedTagObj = tags.find(t => t.id === selectedTag);
    // console.log(selectedTagObj, '看看selectedTagObj', tags, selectedTag);
    if (!selectedTag) return;

    addTask({
      id: Date.now().toString(),
      title,
      completed: false,
      tag: selectedTag,  
      groupId: selectedGroup,
      date: new Date().toISOString(),
      time: parseInt(time) || 30,
      points: parseInt(points) || 1
    });

    setTitle('');
    setSelectedTag('');
    setSelectedGroup('');
    setTime('30');
    setPoints('1');
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName, newTagColor);
      setNewTagName('');
      setShowNewTag(false);
    }
  };

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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[400px]">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">{t('newTask')}</Dialog.Title>
            <Dialog.Close className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('taskTitle')}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              autoFocus
            />

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{t('tags')}</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTag?.id === tag.id
                        ? `${tag.color} text-white`
                        : 'bg-gray-100'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowNewTag(true)}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  {t('addTag')}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">分组</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">预计时间（分钟）</label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">任务积分</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {showNewTag && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">{t('tagName')}</label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">{t('tagColor')}</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTagColor(color)}
                        className={`w-6 h-6 rounded-full ${color} ${
                          newTagColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTag(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1 text-sm bg-[#5252FF] text-white rounded"
                  >
                    {t('create')}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#5252FF] text-white rounded-lg"
                disabled={!title.trim() || !selectedTag}
              >
                {t('create')}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewTaskDialog;
