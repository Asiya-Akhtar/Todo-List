
import { format, isToday, isTomorrow, isPast, addDays, startOfDay, differenceInCalendarDays, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'EEE, MMM d');
};

export const getMyDayDate = (): string => {
  const now = new Date();
  return `${format(now, 'EEEE')}, ${format(now, 'MMMM d')}`;
};

export const isTaskForMyDay = (taskAddedAt?: string): boolean => {
  if (!taskAddedAt) return false;
  return isToday(parseISO(taskAddedAt));
};

export const isTaskDueLater = (dueDate?: string): boolean => {
    if(!dueDate) return false;
    const date = parseISO(dueDate);
    return isTomorrow(date) || (!isToday(date) && !isPast(date));
}

export const isTaskRecent = (createdAt: string): boolean => {
    const date = parseISO(createdAt);
    return differenceInCalendarDays(new Date(), date) <= 7;
}

export const getTodayISO = (): string => {
    return startOfDay(new Date()).toISOString();
}

export const isTaskCompletedToday = (completedAt?: string): boolean => {
    if (!completedAt) return false;
    return isToday(parseISO(completedAt));
};
