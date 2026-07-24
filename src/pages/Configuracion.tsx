import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Settings, User, Bell, LogOut, Save, Trash2, AlertTriangle, Eye, EyeOff, Moon, Sun, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProductos } from '@/hooks/useProductos';
import { useTheme } from '@/hooks/useTheme';

export default function Configuracion() {
    const { user, signOut } = useAuth();
    const { borrarTodo } = useProductos();
    const { theme, toggleTheme } = useTheme();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [showDeletePwd, setShowDeletePwd] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleDeleteAll = () => {
        // Validate against the known password
        if (deletePassword !== 'Miguel1nmiguel0n') {
            setDeleteError('Contraseña incorrecta');
            return;
        }
        borrarTodo();
        setDeletePassword('');
        setDeleteError('');
        setShowDeleteDialog(false);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
    };

    return (
        <motion.div
            className="space-y-6 max-w-[800px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Configuración</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Administra tu cuenta y preferencias</p>
            </div>

            {/* Success toast */}
            <AnimatePresence>
                {deleteSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm px-4 py-3 rounded-xl text-center font-medium"
                    >
                        ✅ Todos los datos han sido eliminados correctamente
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile */}
            <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <User size={20} className="text-gray-600 dark:text-gray-400" />
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Perfil</h3>
                    </div>
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="dark:text-gray-300">Nombre</Label>
                                <Input defaultValue={user?.displayName || ''} placeholder="Tu nombre" className="rounded-xl dark:bg-gray-800 dark:border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label className="dark:text-gray-300">Email</Label>
                                <Input defaultValue={user?.email || ''} disabled className="rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="dark:text-gray-300">Nombre del Negocio</Label>
                            <Input defaultValue="Verduras El Tomate" placeholder="Tu negocio" className="rounded-xl dark:bg-gray-800 dark:border-gray-700" />
                        </div>
                        <Button className="rounded-xl flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}>
                            <Save size={16} /> Guardar Cambios
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* AI Vision Configuration (Gemini API Key) */}
            <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Camera size={20} className="text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Configuración de Escáner IA (Google Gemini)</h3>
                            <p className="text-xs text-gray-500">Clave de API para lectura automática de notas de remisión escritas a mano</p>
                        </div>
                    </div>
                    <Separator className="mb-4" />
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold dark:text-gray-300">Google Gemini API Key (Gratis)</Label>
                            <Input
                                type="password"
                                defaultValue={localStorage.getItem('gemini_api_key') || ''}
                                onChange={e => localStorage.setItem('gemini_api_key', e.target.value.trim())}
                                placeholder="AIzaSy..."
                                className="rounded-xl font-mono text-xs dark:bg-gray-800 dark:border-gray-700"
                            />
                            <p className="text-[11px] text-gray-500">
                                La clave se guarda de forma segura en tu navegador. Puedes obtener una gratis en <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-semibold">aistudio.google.com</a>.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings size={20} className="text-gray-600 dark:text-gray-400" />
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Apariencia</h3>
                    </div>
                    <Separator className="mb-4" />
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Modo oscuro</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Cambia entre tema claro y oscuro</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={toggleTheme}
                            className="rounded-xl gap-2 dark:border-gray-700"
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell size={20} className="text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Notificaciones PWA</h3>
                                <p className="text-xs text-gray-500">Alertas automáticas en pantalla y celular</p>
                            </div>
                        </div>
                    </div>
                    <Separator />

                    <div className="space-y-3">
                        {[
                            { label: 'Alertas de stock bajo', desc: 'Cuando un producto tenga menos de 5kg', defaultChecked: true },
                            { label: 'Resumen diario', desc: 'Resumen automático con ganancias del día', defaultChecked: true },
                            { label: 'Alertas de pérdida', desc: 'Cuando vendas con alto margen negativo o merma', defaultChecked: true },
                            { label: 'Nuevos pedidos de clientes', desc: 'Avisar cuando un cliente envíe pedido express', defaultChecked: true },
                        ].map((n, i) => (
                            <div key={i} className="flex items-center justify-between py-1">
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{n.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked={n.defaultChecked} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Notification Simulators */}
                    <div className="pt-3 border-t border-slate-100 dark:border-gray-800 space-y-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Bell className="w-4 h-4 text-amber-500" />
                            <span>Probar y Simular Notificaciones en Celular / Pantalla:</span>
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if ('Notification' in window && Notification.permission !== 'granted') {
                                        Notification.requestPermission();
                                    }
                                    if ('Notification' in window && Notification.permission === 'granted') {
                                        new Notification('🛒 Nuevo Pedido en Tienda', {
                                            body: 'Doña María Pérez pidió $185 MXN (Recojo en 30 min)',
                                            icon: '/logo.png'
                                        });
                                    } else {
                                        alert('🛒 NOTIFICACIÓN: ¡Doña María Pérez envió un nuevo pedido de $185 MXN para recoger en 30 min!');
                                    }
                                }}
                                className="rounded-xl text-xs font-bold border-emerald-300 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 h-9"
                            >
                                Simular Pedido Express
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if ('Notification' in window && Notification.permission === 'granted') {
                                        new Notification('⚠️ Alerta Stock Bajo', {
                                            body: '¡Quedan solo 3.5 kg de Tomate Bola en existencia!',
                                            icon: '/logo.png'
                                        });
                                    } else {
                                        alert('⚠️ ALERTA STOCK BAJO: ¡Le quedan solo 3.5 kg de Tomate Bola en tienda!');
                                    }
                                }}
                                className="rounded-xl text-xs font-bold border-amber-300 text-amber-800 dark:text-amber-300 hover:bg-amber-50 h-9"
                            >
                                Simular Stock Bajo
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    alert('📊 RESUMEN DIARIO: Hoy registraste $1,885.00 en compras escaneadas y $635.00 en ganancias proyectadas.');
                                }}
                                className="rounded-xl text-xs font-bold border-blue-300 text-blue-800 dark:text-blue-300 hover:bg-blue-50 h-9"
                            >
                                Simular Resumen Diario
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border border-red-200 dark:border-red-900 shadow-sm dark:bg-gray-900">
                <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-red-700 dark:text-red-400 mb-2">⚠️ Zona de Peligro</h3>
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                        {/* Delete all data */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Borrar todos los datos</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Elimina todos los productos, compras y ventas</p>
                            </div>
                            <Button
                                variant="outline"
                                className="rounded-xl text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 gap-2"
                                onClick={() => { setShowDeleteDialog(true); setDeletePassword(''); setDeleteError(''); }}
                            >
                                <Trash2 size={16} /> Borrar todo
                            </Button>
                        </div>
                        {/* Sign out */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Cerrar sesión</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Salir de tu cuenta</p>
                            </div>
                            <Button variant="outline" className="rounded-xl text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 gap-2" onClick={signOut}>
                                <LogOut size={16} /> Cerrar sesión
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete confirmation dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl dark:bg-gray-900">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle size={20} />
                            Confirmar eliminación
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Esta acción eliminará <strong>todos los productos, compras y ventas</strong> guardados.
                            Para continuar, ingresa tu contraseña.
                        </p>
                        <div className="space-y-2">
                            <Label className="dark:text-gray-300">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    type={showDeletePwd ? 'text' : 'password'}
                                    value={deletePassword}
                                    onChange={e => { setDeletePassword(e.target.value); setDeleteError(''); }}
                                    placeholder="Ingresa tu contraseña"
                                    className="rounded-xl pr-10 dark:bg-gray-800 dark:border-gray-700"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowDeletePwd(!showDeletePwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showDeletePwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        {deleteError && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-600 font-medium text-center"
                            >
                                {deleteError}
                            </motion.p>
                        )}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                                className="flex-1 rounded-xl dark:border-gray-700"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDeleteAll}
                                disabled={!deletePassword}
                                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                            >
                                Borrar todo
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
