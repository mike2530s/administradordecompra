import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, TrendingUp, Package } from 'lucide-react';
import { formatearMoneda, formatearPorcentaje } from '@/lib/calculations';

const ventasRecientes = [
    { fecha: '13/02/2026', producto: 'Tomates', cantidad: 10, precio: 3.50, total: 35, ganancia: 15, margen: 42.8 },
    { fecha: '13/02/2026', producto: 'Papas', cantidad: 20, precio: 2.20, total: 44, ganancia: 14, margen: 31.8 },
    { fecha: '12/02/2026', producto: 'Zanahorias', cantidad: 15, precio: 2.00, total: 30, ganancia: 12, margen: 40 },
    { fecha: '12/02/2026', producto: 'Chiles', cantidad: 5, precio: 5.00, total: 25, ganancia: 10, margen: 40 },
    { fecha: '11/02/2026', producto: 'Tomates', cantidad: 15, precio: 3.50, total: 52.5, ganancia: 22.5, margen: 42.8 },
    { fecha: '11/02/2026', producto: 'Lechugas', cantidad: 8, precio: 2.00, total: 16, ganancia: 1.6, margen: 10 },
];

export default function Ventas() {
    return (
        <motion.div
            className="space-y-6 max-w-[1400px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Ventas</h1>
                <p className="text-sm text-gray-500 mt-1">Registro de ventas y ganancias</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <DollarSign size={22} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Vendido Hoy</p>
                                <p className="text-xl font-bold text-gray-800">{formatearMoneda(79)}</p>
                                <p className="text-xs text-emerald-600 font-medium">+{formatearMoneda(29)} ganancia</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Calendar size={22} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Vendido esta Semana</p>
                                <p className="text-xl font-bold text-gray-800">{formatearMoneda(202.5)}</p>
                                <p className="text-xs text-emerald-600 font-medium">+{formatearMoneda(75.1)} ganancia</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                                <TrendingUp size={22} className="text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Margen Promedio</p>
                                <p className="text-xl font-bold text-gray-800">{formatearPorcentaje(34.6)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sales list */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">Ventas Recientes</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs uppercase">Fecha</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs uppercase">Producto</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Cantidad</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Precio/kg</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Total</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Ganancia</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase hidden md:table-cell">Margen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventasRecientes.map((v, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-2 text-gray-600">{v.fecha}</td>
                                        <td className="py-3 px-2 font-medium text-gray-800">{v.producto}</td>
                                        <td className="py-3 px-2 text-right text-gray-600">{v.cantidad}kg</td>
                                        <td className="py-3 px-2 text-right text-gray-600">{formatearMoneda(v.precio)}</td>
                                        <td className="py-3 px-2 text-right font-medium text-gray-800">{formatearMoneda(v.total)}</td>
                                        <td className={`py-3 px-2 text-right font-medium ${v.ganancia >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {v.ganancia >= 0 ? '+' : ''}{formatearMoneda(v.ganancia)}
                                        </td>
                                        <td className={`py-3 px-2 text-right hidden md:table-cell font-medium ${v.margen >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {formatearPorcentaje(v.margen)}
                                        </td>
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
