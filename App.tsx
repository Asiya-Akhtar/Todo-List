import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.tsx';
import Dashboard from './pages/Dashboard.tsx';
import PendingPage from './pages/PendingPage.tsx';
import CompletedPage from './pages/CompletedPage.tsx';
import { useThemeStore } from './store/useTheme.ts';

// Keeps the <html> dark class in sync with your theme store
const ThemeManager: React.FC = () => {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
};

function App() {
  return (
    <>
      <ThemeManager />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Navigate to="/app/my-day" replace />} />
          <Route path="/app/:listId" element={<Dashboard />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/completed" element={<CompletedPage />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
