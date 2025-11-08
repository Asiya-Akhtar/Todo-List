
import React, { useState, useMemo } from 'react';
import { Sun, Star, Calendar, ChevronsRight, List, Plus, Search, Trash2, Settings } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { isTaskForMyDay } from '../lib/dates';
import { type List as ListType } from '../types';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ searchQuery, setSearchQuery }) => {
  const { lists, tasks, addList, deleteList } = useStore();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  const navigate = useNavigate();
  const { listId: paramListId } = useParams<{ listId: string }>();
  const selectedList = paramListId || 'my-day';

  const uncompletedTasks = useMemo(() => tasks.filter(t => !t.completedAt), [tasks]);
  
  const tasksDefaultList = useMemo(() => lists.find(l => l.id === 'tasks_default'), [lists]);

  const counts = useMemo(() => ({
    myDay: uncompletedTasks.filter(t => isTaskForMyDay(t.addedToMyDayAt)).length,
    important: uncompletedTasks.filter(t => t.important).length,
    planned: uncompletedTasks.filter(t => t.dueDate).length,
    tasks: uncompletedTasks.length,
  }), [uncompletedTasks]);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#ec4899', '#f97316', '#14b8a6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addList(newListName.trim(), randomColor);
      setNewListName('');
      setIsAddingList(false);
    }
  };
  
  const handleDeleteList = (e: React.MouseEvent, listIdToDelete: string) => {
    e.stopPropagation();
    deleteList(listIdToDelete);
    if (selectedList === listIdToDelete) {
        navigate('/app/my-day', { replace: true });
    }
  };

  const SidebarItem = ({ icon, name, count, to, active }: { icon: React.ReactNode; name: string; count: number; to: string; active: boolean }) => (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
        active
          ? 'bg-slate-200/70 dark:bg-slate-700/60 font-medium text-slate-800 dark:text-slate-100'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/40'
      }`}
    >
      {icon}
      <span className="flex-grow ml-3">{name}</span>
      {count > 0 && <span className="text-xs font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">{count}</span>}
    </button>
  );
  
  type CustomListItemProps = {
    list: ListType;
  };
  
  const CustomListItem: React.FC<CustomListItemProps> = ({ list }) => (
      <div className="group flex items-center w-full rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/40">
          <button
              onClick={() => navigate(`/app/${list.id}`)}
              className={`flex items-center flex-grow text-left px-4 py-2 transition-colors text-sm rounded-lg ${
                selectedList === list.id
                  ? 'bg-slate-200/70 dark:bg-slate-700/60 font-medium text-slate-800 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: list.color }}></span>
              <span className="flex-grow ml-3">{list.name}</span>
              {uncompletedTasks.filter(t => t.listId === list.id).length > 0 && 
                <span className="text-xs font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                    {uncompletedTasks.filter(t => t.listId === list.id).length}
                </span>
              }
          </button>
          <button
              onClick={(e) => handleDeleteList(e, list.id)}
              aria-label={`Delete list ${list.name}`}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
              <Trash2 size={16} />
          </button>
      </div>
  );

  return (
    <aside className="bg-slate-50 dark:bg-slate-900 p-4 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center mb-4">
        <img src="https://picsum.photos/seed/scenery/40/40" alt="User Avatar" className="w-10 h-10 rounded-full" />
        <div className="ml-3 flex-grow">
          <p className="font-semibold text-slate-800 dark:text-slate-100">Asiya To-Do List</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          id="search-input"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-200/70 dark:bg-slate-700/80 border-none rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <nav className="flex flex-col space-y-1 mb-6">
        <SidebarItem icon={<Sun size={20} />} name="My Day" count={counts.myDay} to="/app/my-day" active={selectedList === 'my-day'} />
        <SidebarItem icon={<Star size={20} />} name="Important" count={counts.important} to="/app/important" active={selectedList === 'important'} />
        <SidebarItem icon={<Calendar size={20} />} name="Planned" count={counts.planned} to="/app/planned" active={selectedList === 'planned'} />
        <SidebarItem icon={<ChevronsRight size={20} />} name={tasksDefaultList?.name || 'Tasks'} count={counts.tasks} to="/app/tasks_default" active={selectedList === 'tasks_default'} />
      </nav>

      <hr className="border-slate-200 dark:border-slate-700 my-2" />

      <div className="flex-grow overflow-y-auto space-y-1">
        {lists.filter(l => l.id !== 'tasks_default').map(list => (
            <CustomListItem key={list.id} list={list} />
        ))}
      </div>

      <div className="mt-auto pt-4">
        {isAddingList ? (
          <form onSubmit={handleAddList}>
            <input
              type="text"
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onBlur={() => { if (!newListName) setIsAddingList(false); }}
              placeholder="New list name"
              className="w-full bg-slate-200/70 dark:bg-slate-700/80 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </form>
        ) : (
          <button
            onClick={() => setIsAddingList(true)}
            className="flex items-center w-full px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/40 transition-colors text-sm"
          >
            <Plus size={20} />
            <span className="ml-3">New list</span>
          </button>
        )}
        <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
        <Link 
          to="/" 
          className="flex items-center w-full px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/40 transition-colors text-sm"
          aria-label="Go to landing page to change theme"
        >
          <Settings size={20} />
          <span className="ml-3">Change Theme</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
