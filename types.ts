
export type ListId = string;

export interface List {
  id: ListId;
  name: string;
  color?: string;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  listId: ListId;
  dueDate?: string;      // ISO string
  important: boolean;
  addedToMyDayAt?: string; // ISO string
  createdAt: string;     // ISO string
  completedAt?: string;  // ISO string
  order: number;
}
