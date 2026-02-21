import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Edit, Trash2, ShoppingCart, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { formatearMoneda, formatearPorcentaje } from '@/lib/calculations';

const comprasDemo = [
    { id: '1', fecha: '13/02/2026', producto: 'Tomates', cantidad: 50, precio: 2.00, total: 100, proveedor: 'Juan Pérez' },
    { id: '2', fecha: '13/02/2026', producto: 'Papas', cantidad: 100, precio: 1.50, total: 150, proveedor: 'María García' },
    { id: '3', fecha: '12/02/2026', producto: 'Lechugas', cantidad: 30, precio: 1.80, total: 54, proveedor: 'Juan Pérez' },
    { id: '4', fecha: '12/02/2026', producto: 'Zanahorias', cantidad: 40, precio: 1.20, total: 48, proveedor: 'Pedro López' },
    { id: '5', fecha: '11/02/2026', producto: 'Chiles', cantidad: 20, precio: 3.00, total: 60, proveedor: 'María García' },
    { id: '6', fecha: '11/02/2026', producto: 'Cebollas', cantidad: 60, precio: 1.40, total: 84, proveedor: 'Juan Pérez' },
    { id: '7', fecha: '10/02/2026', producto: 'Tomates', cantidad: 45, precio: 2.10, total: 94.5, proveedor: 'Pedro López' },
    { id: '8', fecha: '10/02/2026', producto: 'Calabazas', cantidad: 25, precio: 1.60, total: 40, proveedor: 'María García' },
];

const ventasDemo = [
    { id: '1', fecha: '13/02/2026', producto: 'Tomates', cantidad: 10, precio: 3.50, total: 35, ganancia: 15, margen: 42.8 },
    { id: '2', fecha: '13/02/2026', producto: 'Papas', cantidad: 20, precio: 2.20, total: 44, ganancia: 14, margen: 31.8 },
    { id: '3', fecha: '12/02/2026', producto: 'Zanahorias', cantidad: 15, precio: 2.00, total: 30, ganancia: 12, margen: 40 },
    { id: '4', fecha: '12/02/2026', producto: 'Chiles', cantidad: 5, precio: 5.00, total: 25, ganancia: 10, margen: 40 },
    { id: '5', fecha: '11/02/2026', producto: 'Tomates', cantidad: 15, precio: 3.50, total: 52.5, ganancia: 22.5, margen: 42.8 },
    { id: '6', fecha: '11/02/2026', producto: 'Lechugas', cantidad: 8, precio: 2.00, total: 16, ganancia: 1.6, margen: 10 },
    { id: '7', fecha: '10/02/2026', producto: 'Papas', cantidad: 30, precio: 2.20, total: 66, ganancia: 21, margen: 31.8 },
    { id: '8', fecha: '10/02/2026', producto: 'Espinacas', cantidad: 5, precio: 2.40, total: 12, ganancia: -0.5, margen: -4.2 },
];

export default function Historial() {
    const [searchCompras, setSearchCompras] = useState('');
    const [searchVentas, setSearchVentas] = useState('');

    const handleExportCSV = (type: 'compras' | 'ventas') => {
        let csv = '';
        if (type === 'compras') {
            csv = 'Fecha,Producto,Cantidad,Precio/kg,Total,Proveedor\n';
            comprasDemo.forEach(c => {
                csv += `${c.fecha},${c.producto},${c.cantidad},${c.precio},${c.total},${c.proveedor}\n`;
            });
        } else {
            csv = 'Fecha,Producto,Cantidad,Precio/kg,Total,Ganancia,Margen\n';
            ventasDemo.forEach(v => {
                csv += `${v.fecha},${v.producto},${v.cantidad},${v.precio},${v.total},${v.ganancia},${v.margen}%\n`;
            });
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            className="space-y-6 max-w-[1400px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Historial de Transacciones</h1>
                <p className="text-sm text-gray-500 mt-1">Registro completo de compras y ventas</p>
            </div>

            <Tabs defaultValue="compras" className="w-full">
                <TabsList className="bg-gray-100 rounded-xl p-1">
                    <TabsTrigger value="compras" className="rounded-lg flex items-center gap-2 data-[state=active]:bg-white">
                        <ShoppingCart size={16} /> Compras
                    </TabsTrigger>
                    <TabsTrigger value="ventas" className="rounded-lg flex items-center gap-2 data-[state=active]:bg-white">
                        <DollarSign size={16} /> Ventas
                    </TabsTrigger>
                </TabsList>

                {/* Compras Tab */}
                <TabsContent value="compras">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        value={searchCompras}
                                        onChange={e => setSearchCompras(e.target.value)}
                                        placeholder="Buscar por producto o proveedor..."
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-xl flex items-center gap-2"
                                    onClick={() => handleExportCSV('compras')}
                                >
                                    <Download size={16} /> Exportar CSV
                                </Button>
                            </div>

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
                                            <th className="text-center py-3 px-2 text-gray-500 font-medium text-xs uppercase">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comprasDemo
                                            .filter(c => c.producto.toLowerCase().includes(searchCompras.toLowerCase()) || c.proveedor.toLowerCase().includes(searchCompras.toLowerCase()))
                                            .map((c) => (
                                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3 px-2 text-gray-600">{c.fecha}</td>
                                                    <td className="py-3 px-2 font-medium text-gray-800">{c.producto}</td>
                                                    <td className="py-3 px-2 text-right text-gray-600">{c.cantidad}kg</td>
                                                    <td className="py-3 px-2 text-right text-gray-600">{formatearMoneda(c.precio)}</td>
                                                    <td className="py-3 px-2 text-right font-medium text-blue-600">{formatearMoneda(c.total)}</td>
                                                    <td className="py-3 px-2 text-gray-600 hidden md:table-cell">{c.proveedor}</td>
                                                    <td className="py-3 px-2 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                                                                <Edit size={14} />
                                                            </button>
                                                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Ventas Tab */}
                <TabsContent value="ventas">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        value={searchVentas}
                                        onChange={e => setSearchVentas(e.target.value)}
                                        placeholder="Buscar por producto..."
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-xl flex items-center gap-2"
                                    onClick={() => handleExportCSV('ventas')}
                                >
                                    <Download size={16} /> Exportar CSV
                                </Button>
                            </div>

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
                                            <th className="text-center py-3 px-2 text-gray-500 font-medium text-xs uppercase">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ventasDemo
                                            .filter(v => v.producto.toLowerCase().includes(searchVentas.toLowerCase()))
                                            .map((v) => (
                                                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
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
                                                    <td className="py-3 px-2 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                                                                <Edit size={14} />
                                                            </button>
                                                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
