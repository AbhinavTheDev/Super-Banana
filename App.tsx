
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { HistoryProvider } from './hooks/useHistory';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import ProductPage from './pages/ProductPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:id?" element={<EditorPage />} />
        <Route path="/product/:id?" element={<ProductPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="flex-1 p-4 sm:p-6 lg:p-8"
  >
    {children}
  </motion.div>
);

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        <Header />
        <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <PageWrapper>
                    <AnimatedRoutes />
                </PageWrapper>
            </main>
        </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </HistoryProvider>
    </ThemeProvider>
  );
};

export default App;
