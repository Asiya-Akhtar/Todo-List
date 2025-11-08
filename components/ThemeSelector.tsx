import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore, type Theme } from '../store/useTheme.ts';

const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun size={16} /> },
  { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
];

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center space-x-2 p-1 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`flex items-center justify-center w-28 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            theme === option.value
              ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
          }`}
          aria-pressed={theme === option.value}
          aria-label={`Select ${option.label} theme`}
        >
          {option.icon}
          <span className="ml-2">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
