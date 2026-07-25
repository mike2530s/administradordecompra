import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, TrendingUp, Trash2, ShoppingBag } from 'lucide-react';
import { formatearMoneda, formatearPorcentaje } from '@/lib/calculations';

export interface VentaItem {
    id: string;
    fecha: string;
    producto: string;
    cantidad: number;
    unidad?: string;
    precio: number;
    total: number;
    ganancia: number;
    margen: number;
}

const VENTAS_STORAGE_KEY = 'verduras_pro_ventas_v2';

function loadVentasLocal(): VentaItem[] {
    try {
        const saved = localStorage.getItem(VENTAS_STORAGE_KEY);
        if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch { /* ignore */ }
    return [
        { id: 'v1', fecha: '24/07/2026', producto: 'Tomate Bola Fresco', cantidad: 10, unidad: 'kg', precio: 24.00, total: 240.00, ganancia: 90.00, margen: 37.5 },
        { id: 'v2', fecha: '24/07/2026', producto: 'Papa Blanca Seleccionada', cantidad: 15, unidad: 'kg', precio: 20.00, total: 300.00, ganancia: 120.00, margen: 40.0 },
        { id: 'v3', fecha: '23/07/2026', producto: 'Aguacate Hass Maduro', cantidad: 5, unidad: 'kg', precio: 72.00, total: 360.00, ganancia: 135.00, margen: 37.5 },
        { id: 'v4', fecha: '23/07/2026', producto: 'Aceite Vegetal de Cocina 1L', cantidad: 4, unidad: 'unidad', precio: 39.00, total: 156.00, ganancia: 44.00, margen: 28.2 },
        { id: 'v5', fecha: '22/07/2026', producto: 'Jabón Zote Blanco 400g', cantidad: 6, unidad: 'unidad', precio: 24.00, total: 144.00, ganancia: 48.00, margen: 33.3 }
    ];
}

export default function Ventas() {
    const [ventas, setVentas] = useState<VentaItem[]>(loadVentasLocal);

    useEffect(() => {
        localStorage.setItem(VENTAS_STORAGE_KEY, JSON.stringify(ventas));
    }, [ventas]);

    const totalVendidoHoy = useMemo(() => {
        return ventas.reduce((acc, v) => acc + v.total, 0);
    }, [ventas]);

    const totalGanancia = useMemo(() => {
        return ventas.reduce((acc, v) => acc + v.ganancia, 0);
    }, [ventas]);

    const margenPromedio = useMemo(() => {
        if (ventas.length === 0) return 0;
        const totalMargen = ventas.reduce((acc, v) => acc + v.margen, 0);
        return totalMargen / ventas.length;
    }, [ventas]);

    const eliminarVenta = (id: string) => {
        setVentas(prev => prev.filter(v => v.id !== id));
    };

    const borrarTodasLasVentas = () => {
        if (window.confirm('¿Seguro que deseas borrar todo el historial de ventas?')) {
            setVentas([]);
            localStorage.setItem(VENTAS_STORAGE_KEY, JSON.stringify([]));
        }
    };

    return (
        <motion.div
            className="space-y-6 max-w-[1400px] mx-auto pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        Registro de Ventas & Ganancias Reales
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            Ventas en Vivo
                        </span>
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Control completo de ingresos cobrados en tienda</p>
                </div>

                {ventas.length > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={borrarTodasLasVentas}
                        className="rounded-xl text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 h-9 gap-1.5 self-start sm:self-auto"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Borrar Historial Ventas
                    </Button>
                )}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <DollarSign size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Total Vendido ($)</p>
                                <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{formatearMoneda(totalVendidoHoy)}</p>
                                <p className="text-xs text-emerald-600 font-bold">+{formatearMoneda(totalGanancia)} ganancia neta</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Calendar size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Ventas Registradas</p>
                                <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{ventas.length} operaciones</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <TrendingUp size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Margen Promedio</p>
                                <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{formatearPorcentaje(margenPromedio)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sales list */}
            <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                <CardContent className="p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-600" /> Historial de Ventas
                    </h3>

                    {ventas.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs font-semibold space-y-1">
                            <Trash2 size={24} className="mx-auto text-slate-300 mb-1" />
                            <p>No hay ventas registradas en el historial.</p>
                            <p className="text-[11px] text-slate-400">Las nuevas ventas que cobres en la tienda aparecerán aquí.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 uppercase font-semibold text-[10px]">
                                        <th className="text-left py-3 px-2">Fecha</th>
                                        <th className="text-left py-3 px-2">Producto</th>
                                        <th className="text-right py-3 px-2">Cantidad</th>
                                        <th className="text-right py-3 px-2">Precio/Venta</th>
                                        <th className="text-right py-3 px-2 font-bold text-slate-900">Total Cobrado</th>
                                        <th className="text-right py-3 px-2 text-emerald-700 font-bold">Ganancia Neta</th>
                                        <th className="text-right py-3 px-2 hidden md:table-cell">Margen</th>
                                        <th className="text-center py-3 px-2">Borrar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                                    {ventas.map((v) => (
                                        <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
                                            <td className="py-3 px-2 text-gray-600">{v.fecha}</td>
                                            <td className="py-3 px-2 font-bold text-gray-900 dark:text-gray-100">{v.producto}</td>
                                            <td className="py-3 px-2 text-right text-gray-700 font-semibold">{v.cantidad} {v.unidad || 'kg'}</td>
                                            <td className="py-3 px-2 text-right text-gray-600 font-medium">{formatearMoneda(v.precio)}</td>
                                            <td className="py-3 px-2 text-right font-black text-slate-900 dark:text-gray-100">{formatearMoneda(v.total)}</td>
                                            <td className="py-3 px-2 text-right font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">
                                                +{formatearMoneda(v.ganancia)}
                                            </td>
                                            <td className="py-3 px-2 text-right font-bold text-slate-600 hidden md:table-cell">{v.margen.toFixed(1)}%</td>
                                            <td className="py-3 px-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarVenta(v.id)}
                                                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                                    title="Borrar venta"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
