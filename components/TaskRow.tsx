import React from 'react';
import { Star } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { type Task } from '../types';
import { useStore } from '../store/useStore';

interface TaskRowProps {
  task: Task;
  listName: string;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, listName }) => {
  const updateTask = useStore(state => state.updateTask);
  const toggleImportant = useStore(state => state.toggleImportant);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleComplete = () => {
    updateTask(task.id, { completedAt: task.completedAt ? undefined : new Date().toISOString() });
  };

  const handleToggleImportant = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleImportant(task.id);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center p-3 my-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 cursor-grab active:cursor-grabbing touch-none ${task.completedAt ? 'opacity-50' : ''}`}
    >
      <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
          <input
              type="checkbox"
              checked={!!task.completedAt}
              onChange={handleToggleComplete}
              className="appearance-none h-5 w-5 rounded-sm bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 checked:bg-blue-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 transition-colors"
              aria-label={`Mark task ${task.title} as complete`}
          />
          {task.completedAt && (
              <svg className="absolute w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
          )}
      </div>
      <div className="flex-grow mx-4">
        <p className={`text-slate-800 dark:text-slate-100 ${task.completedAt ? 'line-through' : ''}`}>{task.title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{listName}</p>
      </div>
      <button
        onClick={handleToggleImportant}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={`Mark task ${task.title} as important`}
        className="p-2 text-slate-400 hover:text-yellow-400 dark:text-slate-500 dark:hover:text-yellow-400 transition-colors"
      >
        <Star size={20} className={`transition-all ${task.important ? 'fill-yellow-400 text-yellow-400' : ''}`} />
      </button>
    </motion.div>
  );
};

export default TaskRow;