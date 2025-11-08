
import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar.tsx';
import TaskRow from '../components/TaskRow.tsx';
import { useStore } from '../store/useStore.ts';
import { type Task } from '../types.ts';
import { AnimatePresence } from 'framer-motion';

const CompletedPage: React.FC = () => {
  const { lists, tasks } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const completedTasks = useMemo(() => {
    return tasks
      .filter(t => t.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  }, [tasks]);
  
  const displayedTasks = useMemo(() => {
    if (!searchQuery) return completedTasks;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return completedTasks.filter(t => t.title.toLowerCase().includes(lowerCaseQuery));
  }, [completedTasks, searchQuery]);

  const getListName = (listId: string) => lists.find(l => l.id === listId)?.name || 'Tasks';

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="flex flex-col overflow-hidden p-6 bg-slate-100 dark:bg-slate-900">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">All Completed Tasks</h1>
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

export default CompletedPage;
