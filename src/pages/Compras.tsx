import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, TrendingDown, Package } from 'lucide-react';
import { formatearMoneda } from '@/lib/calculations';

const comprasRecientes = [
    { fecha: '13/02/2026', producto: 'Tomates', cantidad: 50, precio: 2.00, total: 100, proveedor: 'Juan Pérez' },
    { fecha: '13/02/2026', producto: 'Papas', cantidad: 100, precio: 1.50, total: 150, proveedor: 'María García' },
    { fecha: '12/02/2026', producto: 'Lechugas', cantidad: 30, precio: 1.80, total: 54, proveedor: 'Juan Pérez' },
    { fecha: '12/02/2026', producto: 'Zanahorias', cantidad: 40, precio: 1.20, total: 48, proveedor: 'Pedro López' },
    { fecha: '11/02/2026', producto: 'Chiles', cantidad: 20, precio: 3.00, total: 60, proveedor: 'María García' },
    { fecha: '11/02/2026', producto: 'Cebollas', cantidad: 60, precio: 1.40, total: 84, proveedor: 'Juan Pérez' },
];

const totalHoy = 250;
const totalSemana = 630.5;

export default function Compras() {
    return (
        <motion.div
            className="space-y-6 max-w-[1400px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Compras</h1>
                <p className="text-sm text-gray-500 mt-1">Registro de compras al mayoreo</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Calendar size={22} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Compras Hoy</p>
                                <p className="text-xl font-bold text-gray-800">{formatearMoneda(totalHoy)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                                <ShoppingCart size={22} className="text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Compras esta Semana</p>
                                <p className="text-xl font-bold text-gray-800">{formatearMoneda(totalSemana)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Package size={22} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Productos Comprados</p>
                                <p className="text-xl font-bold text-gray-800">6</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Purchases list */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">Compras Recientes</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs uppercase">Fecha</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs uppercase">Producto</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Cantidad</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Precio/kg</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Total</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs uppercase hidden md:table-cell">Proveedor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comprasRecientes.map((c, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-2 text-gray-600">{c.fecha}</td>
                                        <td className="py-3 px-2 font-medium text-gray-800">{c.producto}</td>
                                        <td className="py-3 px-2 text-right text-gray-600">{c.cantidad}kg</td>
                                        <td className="py-3 px-2 text-right text-gray-600">{formatearMoneda(c.precio)}</td>
                                        <td className="py-3 px-2 text-right font-medium text-blue-600">{formatearMoneda(c.total)}</td>
                                        <td className="py-3 px-2 text-gray-600 hidden md:table-cell">{c.proveedor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
