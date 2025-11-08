import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { addDays, subDays } from 'date-fns';
import { type Task, type List, type ListId } from '../types';

interface StoreState {
    lists: List[];
    tasks: Task[];
}

interface StoreActions {
    addList: (name: string, color: string) => void;
    updateList: (id: ListId, name: string) => void;
    deleteList: (id: ListId) => void;
    addTask: (title: string, listId: ListId, options?: { addToMyDay?: boolean; dueDate?: string }) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleImportant: (id: string) => void;
    reorderTasks: (listId: ListId, activeId: string, overId: string) => void;
}

type AppState = StoreState & StoreActions;

const createSeedData = (): StoreState => {
    const lists: List[] = [
        { id: 'work', name: 'Work', color: '#3b82f6', order: 0 },
        { id: 'personal', name: 'Personal', color: '#8b5cf6', order: 1 },
        { id: 'house', name: 'House', color: '#22c55e', order: 2 },
        { id: 'social', name: 'Social', color: '#ec4899', order: 3 },
        { id: 'tasks_default', name: "Asiya's To-Do List", color: '#64748b', order: 4 },
    ];

    const today = new Date();
    const tasks: Task[] = [
        { id: `task-${Math.random()}`, title: 'Finish Q3 report', listId: 'work', important: true, createdAt: subDays(today, 2).toISOString(), order: 0, addedToMyDayAt: today.toISOString() },
        { id: `task-${Math.random()}`, title: 'Call the plumber', listId: 'house', important: false, createdAt: subDays(today, 1).toISOString(), order: 0, addedToMyDayAt: today.toISOString() },
        { id: `task-${Math.random()}`, title: 'Buy groceries', listId: 'personal', important: false, createdAt: today.toISOString(), dueDate: addDays(today, 1).toISOString(), order: 0 },
        { id: `task-${Math.random()}`, title: 'Schedule team offsite', listId: 'work', important: false, createdAt: subDays(today, 5).toISOString(), dueDate: addDays(today, 5).toISOString(), order: 1 },
        { id: `task-${Math.random()}`, title: 'Plan birthday party', listId: 'social', important: false, createdAt: subDays(today, 10).toISOString(), order: 0 },
        { id: `task-${Math.random()}`, title: 'Pay electricity bill', listId: 'house', important: false, createdAt: today.toISOString(), order: 1, addedToMyDayAt: today.toISOString(), completedAt: today.toISOString() },
        { id: `task-${Math.random()}`, title: 'Read a book chapter', listId: 'personal', important: false, createdAt: subDays(today, 8).toISOString(), order: 1 },
    ];
    return { lists, tasks };
};

const { lists: initialLists, tasks: initialTasks } = createSeedData();

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      lists: initialLists,
      tasks: initialTasks,
      addList: (name, color) => set(produce((state: AppState) => {
        const newList: List = { id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, name, color, order: state.lists.length };
        state.lists.push(newList);
      })),
      updateList: (id, name) => set(produce((state: AppState) => {
        const list = state.lists.find(l => l.id === id);
        if (list) list.name = name;
      })),
      deleteList: (id) => set(produce((state: AppState) => {
          state.lists = state.lists.filter(l => l.id !== id);
          state.tasks = state.tasks.filter(t => t.listId !== id);
      })),
      addTask: (title, listId, options) => set(produce((state: AppState) => {
        const { addToMyDay = false, dueDate } = options || {};
        const now = new Date().toISOString();
        const listTasks = state.tasks.filter(t => t.listId === listId);
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title,
          listId,
          important: false,
          createdAt: now,
          order: listTasks.length,
          addedToMyDayAt: addToMyDay ? now : undefined,
          dueDate,
        };
        state.tasks.push(newTask);
      })),
      updateTask: (id, updates) => set(produce((state: AppState) => {
        const task = state.tasks.find(t => t.id === id);
        if (task) Object.assign(task, updates);
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),
      toggleImportant: (id) => set(produce((state: AppState) => {
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          task.important = !task.important;
        }
      })),
      reorderTasks: (listId, activeId, overId) => set(produce((state: AppState) => {
          const listTasks = state.tasks.filter(t => t.listId === listId);
          const activeIndex = listTasks.findIndex(t => t.id === activeId);
          const overIndex = listTasks.findIndex(t => t.id === overId);
          if (activeIndex === -1 || overIndex === -1) return;

          const [movedItem] = listTasks.splice(activeIndex, 1);
          listTasks.splice(overIndex, 0, movedItem);

          listTasks.forEach((task, index) => {
              const originalTask = state.tasks.find(t => t.id === task.id);
              if (originalTask) originalTask.order = index;
          });
      }))
    }),
    {
      name: 'msTODO:v1',
      partialize: (state) => ({ lists: state.lists, tasks: state.tasks }),
    }
  )
);