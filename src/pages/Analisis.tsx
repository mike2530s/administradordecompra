import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { formatearMoneda } from '@/lib/calculations';
import { Search, Eye, Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { useProductos } from '@/hooks/useProductos';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

export default function Analisis() {
    const { productos } = useProductos();
    const [search, setSearch] = useState('');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Calculate real executive financial KPIs based on registered products & losses
    const financialSummary = useMemo(() => {
        let totalVentasEstimadas = 0;
        let totalCostoInversion = 0;
        let totalPerdidasMerma = 0;
        let totalKgMerma = 0;

        productos.forEach(p => {
            const stock = p.stockKg || 10;
            const mermaKg = p.mermaAcumuladaKg || 0;
            const costoUnit = p.costoPromedio || 10;
            const precioVentaUnit = p.precioVenta || (costoUnit * 1.5);

            totalVentasEstimadas += stock * precioVentaUnit;
            totalCostoInversion += stock * costoUnit;
            totalPerdidasMerma += mermaKg * costoUnit;
            totalKgMerma += mermaKg;
        });

        const gananciaBruta = totalVentasEstimadas - totalCostoInversion;
        const gananciaNetaReal = gananciaBruta - totalPerdidasMerma;
        const margenNeto = totalVentasEstimadas > 0 ? (gananciaNetaReal / totalVentasEstimadas) * 100 : 0;

        return {
            totalVentasEstimadas,
            totalCostoInversion,
            totalPerdidasMerma,
            totalKgMerma,
            gananciaBruta,
            gananciaNetaReal,
            margenNeto
        };
    }, [productos]);

    // Data for Profit vs Cost vs Loss Chart
    const financialChartData = [
        { nombre: 'Ventas Est.', monto: financialSummary.totalVentasEstimadas, color: '#10B981' },
        { nombre: 'Costo Inversión', monto: financialSummary.totalCostoInversion, color: '#3B82F6' },
        { nombre: 'Pérdidas (Merma)', monto: financialSummary.totalPerdidasMerma, color: '#EF4444' },
        { nombre: 'Ganancia Neta', monto: Math.max(0, financialSummary.gananciaNetaReal), color: '#059669' },
    ];

    const filteredProducts = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.categoria && p.categoria.toLowerCase().includes(search.toLowerCase()))
    );

    const selectedProduct = useMemo(() => {
        return productos.find(p => p.id === selectedProductId);
    }, [productos, selectedProductId]);

    return (
        <motion.div
            className="space-y-6 max-w-[1400px] mx-auto pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <BarChart3 className="text-emerald-600 w-6 h-6" />
                    Análisis Financiero: Ganancias & Pérdidas
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Control de mermas, inversión en verdura y rentabilidad neta en tiempo real
                </p>
            </div>

            {/* Executive KPI Cards Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                                Ventas Estimadas
                            </p>
                            <h3 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">
                                {formatearMoneda(financialSummary.totalVentasEstimadas)}
                            </h3>
                            <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                                <TrendingUp size={14} /> Retorno de Inventario
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                            <DollarSign size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                                Costo Inversión (Compras)
                            </p>
                            <h3 className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 mt-1">
                                {formatearMoneda(financialSummary.totalCostoInversion)}
                            </h3>
                            <p className="text-[11px] text-blue-700 mt-1 flex items-center gap-1 font-medium">
                                Capital invertido en verdura
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-sm">
                            <TrendingDown size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                                Pérdidas por Merma
                            </p>
                            <h3 className="text-2xl font-extrabold text-rose-900 dark:text-rose-100 mt-1">
                                {formatearMoneda(financialSummary.totalPerdidasMerma)}
                            </h3>
                            <p className="text-[11px] text-rose-700 mt-1 flex items-center gap-1 font-medium">
                                <AlertTriangle size={14} /> {financialSummary.totalKgMerma} kg desperdiciados
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
                            <AlertTriangle size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-teal-200 bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-teal-100 uppercase tracking-wider">
                                Ganancia Neta Real
                            </p>
                            <h3 className="text-2xl font-black text-white mt-1">
                                {formatearMoneda(financialSummary.gananciaNetaReal)}
                            </h3>
                            <p className="text-[11px] text-teal-100 mt-1 font-bold">
                                Margen neto: {financialSummary.margenNeto.toFixed(1)}%
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold">
                            <PieChartIcon size={24} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recharts Financial Overview */}
            <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                <CardContent className="p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span>Resumen Comparativo: Ventas vs Costos vs Pérdidas</span>
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financialChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="nombre" stroke="#64748B" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748B" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                                    formatter={(value: number | undefined) => [formatearMoneda(value ?? 0)]}
                                />
                                <Bar dataKey="monto" radius={[8, 8, 0, 0]}>
                                    {financialChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Product Table with Spoilage Breakdown */}
            <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Detalle por Producto & Mermas
                        </h3>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Filtrar por verdura..."
                                className="pl-10 rounded-xl h-9 text-xs"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 font-semibold uppercase">
                                    <th className="text-left py-3 px-2">Producto</th>
                                    <th className="text-right py-3 px-2">P. Compra</th>
                                    <th className="text-right py-3 px-2">P. Venta</th>
                                    <th className="text-right py-3 px-2">Stock</th>
                                    <th className="text-right py-3 px-2 text-rose-600">Merma/Pérdida</th>
                                    <th className="text-right py-3 px-2">Ganancia Est.</th>
                                    <th className="text-center py-3 px-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((p) => {
                                    const stock = p.stockKg || 0;
                                    const merma = p.mermaAcumuladaKg || 0;
                                    const gananciaEst = (p.precioVenta - p.costoPromedio) * stock - (merma * p.costoPromedio);

                                    return (
                                        <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-3 px-2 font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-100 shrink-0">
                                                    {p.imagenUrl && <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" />}
                                                </div>
                                                {p.nombre}
                                            </td>
                                            <td className="py-3 px-2 text-right text-slate-600">{formatearMoneda(p.costoPromedio)}</td>
                                            <td className="py-3 px-2 text-right font-semibold text-emerald-600">{formatearMoneda(p.precioVenta)}</td>
                                            <td className="py-3 px-2 text-right text-slate-700">{stock} {p.unidad}s</td>
                                            <td className="py-3 px-2 text-right font-bold text-rose-600">
                                                {merma > 0 ? `${merma} kg (${formatearMoneda(merma * p.costoPromedio)})` : '0 kg'}
                                            </td>
                                            <td className={`py-3 px-2 text-right font-extrabold ${gananciaEst >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {formatearMoneda(gananciaEst)}
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <button
                                                    onClick={() => setSelectedProductId(p.id)}
                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Product detail popup */}
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProductId(null)}>
                <DialogContent className="sm:max-w-[450px] rounded-2xl">
                    {selectedProduct && (
                        <div className="space-y-4">
                            <DialogHeader>
                                <DialogTitle className="text-base font-bold flex items-center gap-2">
                                    <Package className="text-emerald-600" size={20} />
                                    {selectedProduct.nombre}
                                </DialogTitle>
                            </DialogHeader>

                            {selectedProduct.imagenUrl && (
                                <div className="h-40 rounded-xl overflow-hidden bg-slate-100">
                                    <img src={selectedProduct.imagenUrl} alt={selectedProduct.nombre} className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-slate-500 font-medium">Precio Compra</p>
                                    <p className="text-sm font-bold">{formatearMoneda(selectedProduct.costoPromedio)}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-slate-500 font-medium">Precio Venta</p>
                                    <p className="text-sm font-bold text-emerald-600">{formatearMoneda(selectedProduct.precioVenta)}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-slate-500 font-medium">Stock en tienda</p>
                                    <p className="text-sm font-bold">{selectedProduct.stockKg || 0} {selectedProduct.unidad}s</p>
                                </div>
                                <div className="bg-rose-50 p-3 rounded-xl">
                                    <p className="text-rose-600 font-medium">Merma / Pérdida</p>
                                    <p className="text-sm font-bold text-rose-700">{selectedProduct.mermaAcumuladaKg || 0} kg</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
