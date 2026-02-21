import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
    onNewCompra: () => void;
    onNewVenta: () => void;
}

export default function AppLayout({ onNewCompra, onNewVenta }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <Header
                onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                onNewCompra={onNewCompra}
                onNewVenta={onNewVenta}
            />

            <main className="pt-16 min-h-screen">
                <div className="p-4 sm:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
