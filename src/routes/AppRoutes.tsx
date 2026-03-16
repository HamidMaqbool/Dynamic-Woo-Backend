import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard';
import { DataTable } from '../components/DataTable';
import { DynamicForm } from '../components/DynamicForm';
import { UsagePage } from '../components/UsagePage';
import { Settings } from '../components/Settings';

export const AppRoutes: React.FC = () => {
    return (
        <div className="h-full overflow-hidden">
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<DataTable />} />
                <Route path="/products/add" element={<DynamicForm />} />
                <Route path="/products/edit/:id" element={<DynamicForm />} />
                <Route path="/usage" element={<UsagePage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </div>
    );
};
