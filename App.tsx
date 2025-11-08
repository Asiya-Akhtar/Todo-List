
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.tsx';
import Dashboard from './pages/Dashboard.tsx';
import PendingPage from './pages/PendingPage.tsx';
import CompletedPage from './pages/CompletedPage.tsx';
import { useThemeStore } from './store/useTheme.ts';

// This component handles the side-effects of theme changes.
const ThemeManager: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return null; // This component does not render anything.
};

function App() {
  return (
    <>
      <ThemeManager />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Navigate to="/app/my-day" replace />} />
          <Route path="/app/:listId" element={<Dashboard />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/completed" element={<CompletedPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
