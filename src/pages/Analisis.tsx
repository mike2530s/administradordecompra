import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatearMoneda, formatearPorcentaje } from '@/lib/calculations';
import { Search, Eye, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const productosAnalisis = [
    { nombre: 'Tomates', comprado: 200, vendido: 175, stock: 25, precioCompra: 2.00, precioVenta: 3.50, margen: 42.8, ganancia: 262.5, velocidad: 'Alta', recomendacion: 'Comprar más', color: '#10B981' },
    { nombre: 'Zanahorias', comprado: 150, vendido: 130, stock: 20, precioCompra: 1.20, precioVenta: 2.00, margen: 40, ganancia: 104, velocidad: 'Media', recomendacion: 'Mantener', color: '#3B82F6' },
    { nombre: 'Chiles', comprado: 80, vendido: 72, stock: 8, precioCompra: 3.00, precioVenta: 5.00, margen: 40, ganancia: 144, velocidad: 'Alta', recomendacion: 'Comprar más', color: '#8B5CF6' },
    { nombre: 'Papas', comprado: 300, vendido: 280, stock: 20, precioCompra: 1.50, precioVenta: 2.20, margen: 31.8, ganancia: 196, velocidad: 'Alta', recomendacion: 'Mantener', color: '#F59E0B' },
    { nombre: 'Cebollas', comprado: 180, vendido: 155, stock: 25, precioCompra: 1.40, precioVenta: 1.80, margen: 22.2, ganancia: 62, velocidad: 'Media', recomendacion: 'Monitorear', color: '#F97316' },
    { nombre: 'Calabazas', comprado: 100, vendido: 82, stock: 18, precioCompra: 1.60, precioVenta: 2.10, margen: 23.8, ganancia: 41, velocidad: 'Lenta', recomendacion: 'Reducir', color: '#06B6D4' },
    { nombre: 'Pimientos', comprado: 60, vendido: 48, stock: 12, precioCompra: 4.50, precioVenta: 5.50, margen: 18.2, ganancia: 48, velocidad: 'Lenta', recomendacion: 'Monitorear', color: '#EC4899' },
    { nombre: 'Lechugas', comprado: 100, vendido: 85, stock: 15, precioCompra: 1.80, precioVenta: 2.00, margen: 10, ganancia: 17, velocidad: 'Lenta', recomendacion: 'Reducir', color: '#EF4444' },
    { nombre: 'Espinacas', comprado: 50, vendido: 38, stock: 12, precioCompra: 2.50, precioVenta: 2.40, margen: -4.2, ganancia: -3.8, velocidad: 'Lenta', recomendacion: 'Evitar', color: '#DC2626' },
];

function getVelocidadIcon(v: string) {
    if (v === 'Alta') return '🚀';
    if (v === 'Media') return '➡️';
    return '🐌';
}

function getRecColor(r: string) {
    if (r === 'Comprar más') return 'text-emerald-600 bg-emerald-50';
    if (r === 'Mantener') return 'text-blue-600 bg-blue-50';
    if (r === 'Monitorear') return 'text-amber-600 bg-amber-50';
    if (r === 'Reducir') return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
}

export default function Analisis() {
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<typeof productosAnalisis[0] | null>(null);

    const filteredProducts = productosAnalisis.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const demoHistory = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - 13 + i);
        return {
            dia: `${d.getDate()}/${d.getMonth() + 1}`,
            compra: selectedProduct ? selectedProduct.precioCompra * (0.9 + Math.random() * 0.2) : 0,
            venta: selectedProduct ? selectedProduct.precioVenta * (0.9 + Math.random() * 0.2) : 0,
        };
    });

    return (
        <motion.div
            className="space-y-6 max-w-[1400px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Análisis por Producto</h1>
                <p className="text-sm text-gray-500 mt-1">Rendimiento detallado de cada producto</p>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar producto..."
                                className="pl-10 rounded-xl"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs uppercase">Producto</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Comprado</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Vendido</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Stock</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase hidden md:table-cell">P. Compra</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase hidden md:table-cell">P. Venta</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Margen</th>
                                    <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Ganancia</th>
                                    <th className="text-center py-3 px-2 text-gray-500 font-medium text-xs uppercase hidden lg:table-cell">Velocidad</th>
                                    <th className="text-center py-3 px-2 text-gray-500 font-medium text-xs uppercase">Rec.</th>
                                    <th className="text-center py-3 px-2 text-gray-500 font-medium text-xs uppercase">Ver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-2 font-medium text-gray-800">{p.nombre}</td>
                                        <td className="py-3 px-2 text-right text-gray-600">{p.comprado}kg</td>
                                        <td className="py-3 px-2 text-right text-gray-600">{p.vendido}kg</td>
                                        <td className="py-3 px-2 text-right text-gray-600">{p.stock}kg</td>
                                        <td className="py-3 px-2 text-right text-gray-600 hidden md:table-cell">{formatearMoneda(p.precioCompra)}</td>
                                        <td className="py-3 px-2 text-right text-gray-600 hidden md:table-cell">{formatearMoneda(p.precioVenta)}</td>
                                        <td className="py-3 px-2 text-right">
                                            <span className={`font-semibold ${p.margen >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {formatearPorcentaje(p.margen)}
                                            </span>
                                        </td>
                                        <td className={`py-3 px-2 text-right font-medium ${p.ganancia >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {p.ganancia >= 0 ? '+' : ''}{formatearMoneda(p.ganancia)}
                                        </td>
                                        <td className="py-3 px-2 text-center hidden lg:table-cell">
                                            {getVelocidadIcon(p.velocidad)} {p.velocidad}
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <Badge className={`${getRecColor(p.recomendacion)} text-[10px]`}>
                                                {p.recomendacion}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <button
                                                onClick={() => setSelectedProduct(p)}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <Eye size={16} className="text-gray-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Product Detail Modal */}
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent className="sm:max-w-[650px] rounded-2xl max-h-[90vh] overflow-y-auto">
                    {selectedProduct && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl flex items-center gap-2">
                                    <Package size={22} style={{ color: selectedProduct.color }} />
                                    {selectedProduct.nombre}
                                    <Badge className={`${getRecColor(selectedProduct.recomendacion)} ml-2`}>
                                        {selectedProduct.recomendacion}
                                    </Badge>
                                </DialogTitle>
                            </DialogHeader>

                            {/* Key metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                {[
                                    { label: 'Margen', value: formatearPorcentaje(selectedProduct.margen), color: selectedProduct.margen >= 0 ? '#10B981' : '#EF4444' },
                                    { label: 'Ganancia', value: formatearMoneda(selectedProduct.ganancia), color: selectedProduct.ganancia >= 0 ? '#10B981' : '#EF4444' },
                                    { label: 'Merma Est.', value: `${selectedProduct.comprado - selectedProduct.vendido - selectedProduct.stock}kg`, color: '#F59E0B' },
                                    { label: 'Stock', value: `${selectedProduct.stock}kg`, color: '#3B82F6' },
                                ].map((m, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-500">{m.label}</p>
                                        <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Price Evolution Chart */}
                            <div className="mt-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Precio Compra vs Venta (14 días)</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={demoHistory}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="dia" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                                            <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                                            <Tooltip
                                                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                formatter={(value: number | undefined) => [formatearMoneda(value ?? 0)]}
                                            />
                                            <Line type="monotone" dataKey="compra" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Compra" />
                                            <Line type="monotone" dataKey="venta" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Venta" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
