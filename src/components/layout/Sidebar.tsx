import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingCart,
    DollarSign,
    BarChart3,
    History,
    Settings,
    Leaf,
    Package,
    X,
    Moon,
    Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/compras', icon: ShoppingCart, label: 'Compras' },
    { path: '/ventas', icon: DollarSign, label: 'Ventas' },
    { path: '/productos', icon: Package, label: 'Productos' },
    { path: '/analisis', icon: BarChart3, label: 'Análisis' },
    { path: '/historial', icon: History, label: 'Historial' },
    { path: '/configuracion', icon: Settings, label: 'Configuración' },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className={cn(
                    'fixed left-0 top-0 h-screen z-50 flex flex-col shadow-xl w-[260px]',
                    'bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800',
                    'lg:shadow-sm lg:z-40'
                )}
                initial={false}
                animate={{ x: open ? 0 : -260 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {/* Logo + Close */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}>
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-lg text-gray-800 dark:text-gray-100">VerdurasPro</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;
                        return (
                            <NavLink key={path} to={path} onClick={onClose}>
                                <motion.div
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                                        isActive
                                            ? 'text-white shadow-md'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                                    )}
                                    style={isActive ? { background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' } : {}}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-medium">{label}</span>
                                </motion.div>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Theme toggle + Footer */}
                <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="text-sm font-medium">
                            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                        </span>
                    </button>
                    <p className="text-xs text-gray-400 dark:text-gray-600 text-center">VerdurasPro v1.0</p>
                </div>
            </motion.aside>
        </>
    );
}
