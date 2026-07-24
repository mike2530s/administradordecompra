import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Calendar, Camera, Sparkles } from 'lucide-react';
import { formatearMoneda } from '@/lib/calculations';
import NotaScannerModal, { type NotaItemExtrahido } from '@/components/NotaScannerModal';
import { useProductos } from '@/hooks/useProductos';

interface CompraItem {
    fecha: string;
    producto: string;
    cantidad: number;
    unidad: string;
    precio: number;
    precioVenta: number;
    total: number;
    proveedor: string;
}

const comprasIniciales: CompraItem[] = [
    { fecha: '10/07/2026', producto: 'Jitomate Bola', cantidad: 13, unidad: 'kg', precio: 21.00, precioVenta: 16.00, total: 208, proveedor: 'Nota Remisión Vero' },
    { fecha: '10/07/2026', producto: 'Cebolla', cantidad: 3, unidad: 'kg', precio: 21.00, precioVenta: 16.00, total: 48, proveedor: 'Nota Remisión Vero' },
    { fecha: '10/07/2026', producto: 'Aguacate Hass', cantidad: 1.5, unidad: 'kg', precio: 90.00, precioVenta: 85.00, total: 128, proveedor: 'Nota Remisión Vero' },
    { fecha: '10/07/2026', producto: 'Papa', cantidad: 5, unidad: 'kg', precio: 35.00, precioVenta: 30.00, total: 150, proveedor: 'Nota Remisión Vero' },
    { fecha: '10/07/2026', producto: 'Plátano', cantidad: 10.5, unidad: 'kg', precio: 22.50, precioVenta: 17.50, total: 175, proveedor: 'Nota Remisión Vero' },
];

export default function Compras() {
    const { agregarProducto, productos, editarProducto } = useProductos();
    const [compras, setCompras] = useState<CompraItem[]>(comprasIniciales);
    const [showScanner, setShowScanner] = useState(false);

    const totalInversion = compras.reduce((acc, c) => acc + c.total, 0);

    const handleConfirmarScanner = (items: NotaItemExtrahido[], fecha: string) => {
        const nuevasCompras: CompraItem[] = items.map(item => ({
            fecha: fecha || new Date().toLocaleDateString(),
            producto: item.nombre,
            cantidad: item.cantidad,
            unidad: item.unidad,
            precio: item.costoCompra,
            precioVenta: item.precioVenta,
            total: item.costoCompra * item.cantidad,
            proveedor: 'Escáner Nota de Papel'
        }));

        // Append to local state
        setCompras(prev => [...nuevasCompras, ...prev]);

        // Automatically update or add products in store context with cost & sale price!
        items.forEach(item => {
            const existente = productos.find(p => p.nombre.toLowerCase().includes(item.nombre.toLowerCase()));
            if (existente) {
                editarProducto(existente.id, {
                    costoPromedio: item.costoCompra,
                    precioVenta: item.precioVenta,
                    stockKg: (existente.stockKg || 0) + item.cantidad
                });
            } else {
                agregarProducto({
                    nombre: item.nombre,
                    costoPromedio: item.costoCompra,
                    precioVenta: item.precioVenta,
                    unidad: item.unidad,
                    stockKg: item.cantidad,
                    destacadoHoy: true
                });
            }
        });
    };

    return (
        <motion.div
            className="space-y-6 max-w-[1400px] mx-auto pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header with Camera AI Scanner Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        Compras & Registro de Notas
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Escanéale la nota de remisión en papel a tu proveedor para registrar compras automáticamente
                    </p>
                </div>

                <Button
                    onClick={() => setShowScanner(true)}
                    className="rounded-2xl h-11 px-5 gap-2 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                >
                    <Camera size={18} />
                    <span>Escanear Nota de Papel con IA</span>
                </Button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Calendar size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500">Inversión Total Registrada</p>
                                <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{formatearMoneda(totalInversion)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ShoppingCart size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500">Notas Procesadas</p>
                                <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{compras.length} renglones</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500">Lectura de IA (Tinta Azul & Negra)</p>
                                <p className="text-xs font-bold text-emerald-600 mt-1">Activo con Gemini Vision</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Purchases list */}
            <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                <CardContent className="p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Historial de Compras & Costos del Proveedor
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 uppercase font-semibold">
                                    <th className="text-left py-3 px-2">Fecha</th>
                                    <th className="text-left py-3 px-2">Producto</th>
                                    <th className="text-right py-3 px-2">Cantidad</th>
                                    <th className="text-right py-3 px-2 text-blue-700">Costo Prov. (Azul)</th>
                                    <th className="text-right py-3 px-2 text-emerald-700">Venta Pub. ($ Negra)</th>
                                    <th className="text-right py-3 px-2">Total Inversión</th>
                                    <th className="text-left py-3 px-2 hidden md:table-cell">Origen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compras.map((c, i) => (
                                    <tr key={i} className="border-b border-gray-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-3 px-2 text-gray-600">{c.fecha}</td>
                                        <td className="py-3 px-2 font-bold text-gray-900 dark:text-gray-100">{c.producto}</td>
                                        <td className="py-3 px-2 text-right text-gray-700 font-semibold">{c.cantidad} {c.unidad || 'kg'}</td>
                                        <td className="py-3 px-2 text-right text-blue-700 font-bold">{formatearMoneda(c.precio)}</td>
                                        <td className="py-3 px-2 text-right text-emerald-700 font-bold">{formatearMoneda(c.precioVenta)}</td>
                                        <td className="py-3 px-2 text-right font-black text-gray-900 dark:text-gray-100">{formatearMoneda(c.total)}</td>
                                        <td className="py-3 px-2 text-gray-500 hidden md:table-cell text-[11px] font-medium">{c.proveedor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* AI Vision Paper Note Scanner Modal */}
            <NotaScannerModal
                open={showScanner}
                onClose={() => setShowScanner(false)}
                onConfirmarCompras={handleConfirmarScanner}
            />
        </motion.div>
    );
}
