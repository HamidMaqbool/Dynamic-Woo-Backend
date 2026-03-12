/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { DataTable } from './components/DataTable';
import { DynamicForm } from './components/DynamicForm';
import { UsagePage } from './components/UsagePage';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { LoginPage } from './components/LoginPage';
import { useCRMStore } from './store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { IconSprite } from './components/Icon';
import { cn } from './utils/cn';

export default function App() {
  const { view, isAuthenticated, theme } = useCRMStore();

  if (!isAuthenticated) {
    return (
      <div className={cn("h-screen w-full", theme)}>
        <IconSprite />
        <LoginPage />
      </div>
    );
  }

  return (
    <div className={cn("flex h-screen w-full bg-[#F8F9FA] overflow-hidden", theme)}>
      <IconSprite />
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Dashboard />
            </motion.div>
          )}

          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <DataTable />
            </motion.div>
          )}

          {(view === 'add' || view === 'edit') && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <DynamicForm />
            </motion.div>
          )}

          {view === 'usage' && (
            <motion.div
              key="usage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <UsagePage />
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
