import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ShoppingCart, DollarSign, Bell, LogOut, User, Menu, AlertTriangle, Send, Sparkles, Settings, Trash2, CheckCircle2 } from 'lucide-react';
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
    const [showNotifMenu, setShowNotifMenu] = useState(false);

    // Live notifications list
    const [notificaciones, setNotificaciones] = useState([
        {
            id: '1',
            titulo: '🛒 Nuevo Pedido Express',
            desc: 'Doña María Pérez pidió $185.00 MXN (Recojo a las 02:30 PM)',
            tiempo: 'Hace 5 min',
            leido: false,
            tipo: 'pedido'
        },
        {
            id: '2',
            titulo: '⚠️ Stock Bajo en Tienda',
            desc: 'Le quedan solo 3.5 kg de Tomate Bola en existencia',
            tiempo: 'Hace 20 min',
            leido: false,
            tipo: 'stock'
        },
        {
            id: '3',
            titulo: '📸 Nota de Remisión Procesada',
            desc: 'Se registraron $1,885.00 en compras escaneadas con Gemini IA',
            tiempo: 'Hace 1 hora',
            leido: true,
            tipo: 'compra'
        }
    ]);

    const sinLeerCount = notificaciones.filter(n => !n.leido).length;

    const marcarTodasLeidas = () => {
        setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })));
    };

    const limpiarNotificaciones = () => {
        setNotificaciones([]);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-30 flex items-center justify-between px-4 sm:px-6">
            {/* Left: Menu + Title */}
            <div className="flex items-center gap-2.5">
                <button
                    onClick={onMenuToggle}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <Menu size={22} className="text-gray-600 dark:text-gray-300" />
                </button>
                <img src="/logo.png" alt="La Primavera" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-slate-200" />
                <span className="text-base font-extrabold text-gray-800 dark:text-gray-100 hidden sm:block">La Primavera</span>
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

                {/* Notifications Bell Button & Popover */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowNotifMenu(!showNotifMenu);
                            setShowUserMenu(false);
                        }}
                        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                        {sinLeerCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                        )}
                    </button>

                    {showNotifMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)} />
                            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Bell size={16} className="text-emerald-600" />
                                        <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Notificaciones PWA</h4>
                                        {sinLeerCount > 0 && (
                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                                                {sinLeerCount} nuevas
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {sinLeerCount > 0 && (
                                            <button
                                                onClick={marcarTodasLeidas}
                                                className="text-[11px] font-bold text-emerald-600 hover:underline"
                                            >
                                                Marcar leídas
                                            </button>
                                        )}
                                        {notificaciones.length > 0 && (
                                            <button
                                                onClick={limpiarNotificaciones}
                                                className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Limpiar todo
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-72 overflow-y-auto">
                                    {notificaciones.length === 0 ? (
                                        <div className="py-8 text-center text-xs text-slate-400 font-semibold space-y-1">
                                            <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-1" />
                                            <p>No tienes notificaciones pendientes.</p>
                                            <p className="text-[10px] text-slate-400 font-normal">Todo al día en La Primavera</p>
                                        </div>
                                    ) : (
                                        notificaciones.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-3.5 hover:bg-slate-50 dark:hover:bg-gray-800/60 transition-colors flex items-start gap-3 ${!n.leido ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''}`}
                                            >
                                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-emerald-600 shrink-0 mt-0.5">
                                                    {n.tipo === 'pedido' && <Send size={15} className="text-emerald-600" />}
                                                    {n.tipo === 'stock' && <AlertTriangle size={15} className="text-amber-500" />}
                                                    {n.tipo === 'compra' && <Sparkles size={15} className="text-blue-500" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                                                        <span>{n.titulo}</span>
                                                        <span className="text-[10px] font-normal text-gray-400">{n.tiempo}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{n.desc}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="p-2.5 bg-slate-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center">
                                    <button
                                        onClick={() => {
                                            navigate('/configuracion');
                                            setShowNotifMenu(false);
                                        }}
                                        className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1 mx-auto"
                                    >
                                        <Settings size={13} /> Configurar Alertas PWA & WhatsApp
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowUserMenu(!showUserMenu);
                            setShowNotifMenu(false);
                        }}
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
