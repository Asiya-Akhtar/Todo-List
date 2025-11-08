
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';

import Sidebar from '../components/Sidebar.tsx';
import MyDayBanner from '../components/MyDayBanner.tsx';
import TaskRow from '../components/TaskRow.tsx';
import AddBar from '../components/AddBar.tsx';
import SuggestionsPane from '../components/SuggestionsPane.tsx';
import { useStore } from '../store/useStore.ts';
import { isTaskForMyDay } from '../lib/dates.ts';
import { type Task } from '../types.ts';

function Dashboard() {
  const { lists, tasks, reorderTasks } = useStore();
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();
  
  const selectedList = listId || 'my-day';
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Redirect to landing page if no theme has been set yet.
    if (!localStorage.getItem('todo:theme')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        // Find the task being dragged to get its original listId
        const task = tasks.find(t => t.id === active.id);
        if (task) {
             // For all lists (including smart ones), we reorder within the task's original list
             reorderTasks(task.listId, active.id as string, over.id as string);
        }
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === 'a' || e.key === 'n') && (e.target as HTMLElement).tagName !== 'INPUT') {
            e.preventDefault();
            document.getElementById('add-task-input')?.focus();
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const listTitle = useMemo(() => {
    switch (selectedList) {
      case 'my-day':
        return 'My Day';
      case 'important':
        return 'Important';
      case 'planned':
        return 'Planned';
      case 'tasks_default':
        return lists.find(l => l.id === 'tasks_default')?.name || 'Tasks';
      default:
        const list = lists.find(l => l.id === selectedList);
        return list?.name || 'Tasks';
    }
  }, [selectedList, lists]);

  const displayedTasks = useMemo(() => {
    let filteredTasks: Task[] = [];
    const lowerCaseQuery = searchQuery.toLowerCase();

    const allUncompleted = tasks.filter(t => !t.completedAt);

    switch (selectedList) {
      case 'my-day':
        filteredTasks = allUncompleted.filter(t => isTaskForMyDay(t.addedToMyDayAt));
        break;
      case 'important':
        filteredTasks = allUncompleted.filter(t => t.important);
        break;
      case 'planned':
        filteredTasks = allUncompleted.filter(t => !!t.dueDate);
        break;
      case 'tasks_default':
        filteredTasks = allUncompleted;
        break;
      default:
        filteredTasks = allUncompleted.filter(t => t.listId === selectedList);
    }
    
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(t => 
            t.title.toLowerCase().includes(lowerCaseQuery) || 
            (t.notes && t.notes.toLowerCase().includes(lowerCaseQuery))
        );
    }

    // Sort: important tasks first, then by their user-defined order.
    return filteredTasks.sort((a, b) => {
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return a.order - b.order;
    });
  }, [selectedList, tasks, searchQuery]);

  const getListName = (listId: string) => lists.find(l => l.id === listId)?.name || 'Tasks';

  return (
    <div className="grid grid-cols-[280px_minmax(640px,1fr)_360px] h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="flex flex-col overflow-hidden p-6 bg-slate-100 dark:bg-slate-900">
        <div className="flex-grow overflow-y-auto pr-2">
            {selectedList === 'my-day' ? (
              <MyDayBanner />
            ) : (
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">{listTitle}</h1>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={displayedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <AnimatePresence>
                  {displayedTasks.map(task => (
                    <TaskRow key={task.id} task={task} listName={getListName(task.listId)} />
                  ))}
                </AnimatePresence>
              </SortableContext>
            </DndContext>
        </div>
        <AddBar currentListId={selectedList} />
      </main>
      <SuggestionsPane />
    </div>
  );
}

export default Dashboard;
