import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ShoppingCart, DollarSign, Bell, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onMenuToggle: () => void;
    onNewCompra: () => void;
    onNewVenta: () => void;
}

export default function Header({ onMenuToggle, onNewCompra, onNewVenta }: HeaderProps) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-30 flex items-center justify-between px-4 sm:px-6">
            {/* Left: Menu + Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <Menu size={22} className="text-gray-600 dark:text-gray-300" />
                </button>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100 hidden sm:block">VerdurasPro</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={onNewCompra}
                    size="sm"
                    className="rounded-xl font-medium shadow-sm gap-1.5 h-9 px-3 text-xs sm:text-sm sm:px-4"
                    style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
                >
                    <ShoppingCart size={15} />
                    <span className="hidden sm:inline">Compra</span>
                </Button>

                <Button
                    onClick={onNewVenta}
                    size="sm"
                    className="rounded-xl font-medium shadow-sm gap-1.5 h-9 px-3 text-xs sm:text-sm sm:px-4"
                    style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}
                >
                    <DollarSign size={15} />
                    <span className="hidden sm:inline">Venta</span>
                </Button>

                <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Bell size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                            style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}>
                            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </button>

                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.displayName || 'Usuario'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => { navigate('/configuracion'); setShowUserMenu(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <User size={16} />
                                    Perfil
                                </button>
                                <button
                                    onClick={async () => { await signOut(); setShowUserMenu(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Cerrar sesión
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
