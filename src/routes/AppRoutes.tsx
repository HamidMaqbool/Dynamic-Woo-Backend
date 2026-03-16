import React from 'react';
import { useCRMStore } from '../store/useStore';
import { Dashboard } from '../components/Dashboard';
import { DataTable } from '../components/DataTable';
import { DynamicForm } from '../components/DynamicForm';
import { UsagePage } from '../components/UsagePage';
import { Settings } from '../components/Settings';

export const AppRoutes: React.FC = () => {
    const { view, editingProduct } = useCRMStore();

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard />;
            case 'list':
                return <DataTable />;
            case 'add':
            case 'edit':
                return <DynamicForm />;
            case 'usage':
                return <UsagePage />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="h-full overflow-hidden">
            {renderView()}
        </div>
    );
};
