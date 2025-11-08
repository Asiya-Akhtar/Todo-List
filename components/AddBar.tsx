import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { type ListId } from '../types';
import { format } from 'date-fns';

interface AddBarProps {
  currentListId: ListId;
}

const AddBar: React.FC<AddBarProps> = ({ currentListId }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(''); // YYYY-MM-DD
  const addTask = useStore(state => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const smartLists = ['my-day', 'important', 'planned'];
      const isSmartList = smartLists.includes(currentListId);
      
      const listId = isSmartList ? 'tasks_default' : currentListId;
      const addToMyDay = currentListId === 'my-day';

      addTask(
          title.trim(), 
          listId, 
          { 
              addToMyDay: addToMyDay, 
              dueDate: dueDate ? new Date(dueDate + 'T00:00:00').toISOString() : undefined 
          }
      );
      setTitle('');
      setDueDate('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    } else if (e.key === 'Escape') {
        setTitle('');
        setDueDate('');
        e.currentTarget.blur();
    }
  }

  return (
    <div className="sticky bottom-6 mx-auto w-[calc(100%-2rem)]">
      <form
        onSubmit={handleSubmit}
        className="flex items-center rounded-xl backdrop-blur-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-2xl"
      >
        <Plus className="text-blue-500" />
        <input
          id="add-task-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task"
          className="flex-grow bg-transparent outline-none ml-4 text-slate-900 dark:text-slate-200 placeholder-slate-600 dark:placeholder-slate-400"
          autoComplete="off"
        />
        <div 
            className={`relative ml-2 p-2 rounded-full transition-colors ${dueDate ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            title={dueDate ? `Due: ${format(new Date(dueDate + 'T00:00:00'), 'MMM d')}` : 'Add due date'}
        >
            <Calendar size={18} className={`${dueDate ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`} />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Set due date"
            />
        </div>
      </form>
    </div>
  );
};

export default AddBar;