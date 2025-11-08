
import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar.tsx';
import TaskRow from '../components/TaskRow.tsx';
import { useStore } from '../store/useStore.ts';
import { type Task } from '../types.ts';
import { AnimatePresence } from 'framer-motion';

const PendingPage: React.FC = () => {
  const { lists, tasks } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const pendingTasks = useMemo(() => {
    return tasks
      .filter(t => !t.completedAt)
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks]);
  
  const displayedTasks = useMemo(() => {
    if (!searchQuery) return pendingTasks;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return pendingTasks.filter(t => t.title.toLowerCase().includes(lowerCaseQuery));
  }, [pendingTasks, searchQuery]);

  const getListName = (listId: string) => lists.find(l => l.id === listId)?.name || 'Tasks';

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="flex flex-col overflow-hidden p-6 bg-slate-100 dark:bg-slate-900">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">All Pending Tasks</h1>
        <div className="flex-grow overflow-y-auto pr-2">
            <AnimatePresence>
                {displayedTasks.map(task => (
                    <TaskRow key={task.id} task={task} listName={getListName(task.listId)} />
                ))}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PendingPage;
