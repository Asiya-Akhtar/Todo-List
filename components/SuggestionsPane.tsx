import React, { useMemo } from 'react';
import { Plus, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { type Task } from '../types';
import { formatDate, isTaskDueLater, getTodayISO, isTaskCompletedToday } from '../lib/dates';

const SuggestionsPane: React.FC = () => {
  const { lists, tasks, updateTask } = useStore();

  const uncompletedTasks = useMemo(() => tasks.filter(t => !t.completedAt), [tasks]);

  const laterTasks = useMemo(() => {
    return uncompletedTasks
      .filter(t => isTaskDueLater(t.dueDate))
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }, [uncompletedTasks]);
  
  const pendingTasks = useMemo(() => {
    return uncompletedTasks
        .filter(t => !t.dueDate)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [uncompletedTasks]);

  const recentlyCompletedTasks = useMemo(() => {
    return tasks
      .filter(t => isTaskCompletedToday(t.completedAt))
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  }, [tasks]);


  const getListName = (listId: string) => lists.find(l => l.id === listId)?.name || 'Tasks';

  const addToMyDay = (taskId: string) => {
    updateTask(taskId, { addedToMyDayAt: getTodayISO() });
  };
  
  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { completedAt: task.completedAt ? undefined : new Date().toISOString() });
  };

  const SuggestionRow: React.FC<{ task: Task, showAddToMyDay?: boolean }> = ({ task, showAddToMyDay = true }) => (
    <div className="flex items-center justify-between text-sm py-2 group rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/40 px-2 -mx-2">
      <div className="flex items-center flex-grow min-w-0">
          <button
              onClick={() => handleToggleComplete(task)}
              aria-label={`Toggle completion for ${task.title}`}
              className={`flex-shrink-0 w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
                  task.completedAt
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-slate-400 dark:border-slate-600 group-hover:border-slate-500 dark:group-hover:border-slate-400'
              }`}
          >
              {task.completedAt && <Check size={12} className="text-white" />}
          </button>
          <div className="ml-3 flex-grow min-w-0">
            <p className={`text-slate-800 dark:text-slate-200 truncate ${task.completedAt ? 'line-through opacity-60' : ''}`}>{task.title}</p>
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
                <span className="truncate">{getListName(task.listId)}</span>
                {task.dueDate && <span>&middot;</span>}
                {task.dueDate && <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded flex-shrink-0">{formatDate(task.dueDate)}</span>}
            </div>
          </div>
      </div>
      {showAddToMyDay && !task.completedAt && (
          <button
            onClick={() => addToMyDay(task.id)}
            aria-label={`Add ${task.title} to My Day`}
            className="ml-2 p-1 rounded-full text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            <Plus size={18} />
          </button>
      )}
    </div>
  );

  const Section: React.FC<{title: string; count: number; children: React.ReactNode}> = ({title, count, children}) => {
      if (count === 0) return null;
      return (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{title}</h3>
            </div>
            <div className="space-y-1">
                {children}
            </div>
        </div>
      );
  }

  return (
    <aside className="bg-white dark:bg-slate-800/70 backdrop-blur-lg p-6 h-full overflow-y-auto border-l border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Suggestions</h2>
      
      <Section title="For Later" count={laterTasks.length}>
        {laterTasks.slice(0, 5).map(task => <SuggestionRow key={task.id} task={task} />)}
      </Section>
      
      <Section title="Pending" count={pendingTasks.length}>
        {pendingTasks.slice(0, 5).map(task => <SuggestionRow key={task.id} task={task} />)}
      </Section>

      <Section title="Completed Today" count={recentlyCompletedTasks.length}>
        {recentlyCompletedTasks.slice(0, 5).map(task => <SuggestionRow key={task.id} task={task} showAddToMyDay={false} />)}
      </Section>

      {[laterTasks, pendingTasks, recentlyCompletedTasks].every(list => list.length === 0) && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">No suggestions right now. Stay productive!</p>
      )}
    </aside>
  );
};

export default SuggestionsPane;