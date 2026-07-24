import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Camera, Sparkles, Plus, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { formatearMoneda } from '@/lib/calculations';
import NotaScannerModal, { type NotaItemExtrahido } from '@/components/NotaScannerModal';
import { useProductos } from '@/hooks/useProductos';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

interface CompraItem {
    id: string;
    fecha: string;
    producto: string;
    cantidad: number;
    unidad: string;
    precio: number;        // Costo compra proveedor (Azul)
    precioVenta: number;   // Precio venta clienta ($ Negra)
    totalImporte: number;  // Columna IMPORTE
    proveedor: string;
}

// Initial demo compras based on real handwritten receipt from user ($1,885.00)
const comprasIniciales: CompraItem[] = [
    { id: '1', fecha: '10/07/2026', producto: 'Jitomate Bola', cantidad: 13, unidad: 'kg', precio: 21.00, precioVenta: 16.00, totalImporte: 208.00, proveedor: 'Nota Remisión Vero' },
    { id: '2', fecha: '10/07/2026', producto: 'Cebolla (M.)', cantidad: 3, unidad: 'kg', precio: 21.00, precioVenta: 16.00, totalImporte: 48.00, proveedor: 'Nota Remisión Vero' },
    { id: '3', fecha: '10/07/2026', producto: 'Aguacate', cantidad: 1.5, unidad: 'kg', precio: 90.00, precioVenta: 85.00, totalImporte: 128.00, proveedor: 'Nota Remisión Vero' },
    { id: '4', fecha: '10/07/2026', producto: 'Papa', cantidad: 5, unidad: 'kg', precio: 35.00, precioVenta: 30.00, totalImporte: 150.00, proveedor: 'Nota Remisión Vero' },
    { id: '5', fecha: '10/07/2026', producto: 'Plátano', cantidad: 10.5, unidad: 'kg', precio: 22.50, precioVenta: 17.50, totalImporte: 175.00, proveedor: 'Nota Remisión Vero' },
    { id: '6', fecha: '10/07/2026', producto: 'Cilantro', cantidad: 1, unidad: 'atado', precio: 20.00, precioVenta: 20.00, totalImporte: 20.00, proveedor: 'Nota Remisión Vero' },
    { id: '7', fecha: '10/07/2026', producto: 'Tomate', cantidad: 3, unidad: 'kg', precio: 21.00, precioVenta: 16.00, totalImporte: 48.00, proveedor: 'Nota Remisión Vero' },
    { id: '8', fecha: '10/07/2026', producto: 'Naranja', cantidad: 4, unidad: 'kg', precio: 35.00, precioVenta: 30.00, totalImporte: 120.00, proveedor: 'Nota Remisión Vero' },
    { id: '9', fecha: '09/07/2026', producto: 'Limón', cantidad: 10, unidad: 'kg', precio: 30.00, precioVenta: 35.00, totalImporte: 300.00, proveedor: 'Distribuidora Central' },
    { id: '10', fecha: '08/07/2026', producto: 'Mango', cantidad: 15, unidad: 'kg', precio: 38.00, precioVenta: 45.00, totalImporte: 570.00, proveedor: 'Distribuidora Central' },
];

export default function Compras() {
    const { agregarProducto, productos, editarProducto } = useProductos();
    const [compras, setCompras] = useState<CompraItem[]>(comprasIniciales);
    const [showScanner, setShowScanner] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);

    // Manual purchase form state
    const [manualNombre, setManualNombre] = useState('');
    const [manualCantidad, setManualCantidad] = useState('1');
    const [manualUnidad, setManualUnidad] = useState('kg');
    const [manualCosto, setManualCosto] = useState('');
    const [manualVenta, setManualVenta] = useState('');
    const [manualFecha, setManualFecha] = useState('10/07/2026');

    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://192.168.1.149:3001';

    // Fetch purchases from SQLite server
    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/compras`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const mapped: CompraItem[] = data.map(d => ({
                            id: d.id,
                            fecha: d.fecha,
                            producto: d.productoNombre,
                            cantidad: d.cantidad,
                            unidad: d.unidad,
                            precio: d.costoCompra,
                            precioVenta: d.precioVenta,
                            totalImporte: d.totalImporte,
                            proveedor: d.proveedor
                        }));
                        setCompras(mapped);
                    }
                }
            } catch { /* ignore */ }
        };
        fetchCompras();
    }, [SERVER_URL]);

    // KPI total calculation
    const totalInversion = useMemo(() => {
        return compras.reduce((acc, c) => acc + c.totalImporte, 0);
    }, [compras]);

    const totalGananciaProyectada = useMemo(() => {
        return compras.reduce((acc, c) => {
            const margin = Math.max(0, c.precioVenta - c.precio);
            return acc + (margin * c.cantidad);
        }, 0);
    }, [compras]);

    // Group purchases by date for daily expenditures chart
    const dailyChartData = useMemo(() => {
        const grouped: Record<string, number> = {};
        compras.forEach(c => {
            grouped[c.fecha] = (grouped[c.fecha] || 0) + c.totalImporte;
        });

        return Object.entries(grouped)
            .map(([fecha, total]) => ({ fecha, total }))
            .reverse();
    }, [compras]);

    const handleConfirmarScanner = (items: NotaItemExtrahido[], fecha: string) => {
        const fechaFormat = fecha || '10/07/2026';
        const nuevasCompras: CompraItem[] = items.map((item, idx) => ({
            id: `scan-${Date.now()}-${idx}`,
            fecha: fechaFormat,
            producto: item.nombre,
            cantidad: item.cantidad,
            unidad: item.unidad,
            precio: item.costoCompra,
            precioVenta: item.precioVenta,
            totalImporte: item.totalImporte,
            proveedor: 'Escáner Nota en Papel'
        }));

        setCompras(prev => [...nuevasCompras, ...prev]);

        // Post batch to SQLite server
        fetch(`${SERVER_URL}/api/compras/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: nuevasCompras })
        }).catch(() => {});

        // Sync with store inventory & public prices
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

    const handleAgregarCompraManual = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualNombre.trim() || !manualCosto) return;

        const cant = parseFloat(manualCantidad) || 1;
        const costo = parseFloat(manualCosto) || 0;
        const venta = parseFloat(manualVenta) || costo * 1.3;
        const importe = cant * costo;

        const nueva: CompraItem = {
            id: `manual-${Date.now()}`,
            fecha: manualFecha,
            producto: manualNombre.trim(),
            cantidad: cant,
            unidad: manualUnidad,
            precio: costo,
            precioVenta: venta,
            totalImporte: importe,
            proveedor: 'Registro Manual'
        };

        setCompras(prev => [nueva, ...prev]);

        // Sync with product list
        const existente = productos.find(p => p.nombre.toLowerCase().includes(manualNombre.toLowerCase()));
        if (existente) {
            editarProducto(existente.id, {
                costoPromedio: costo,
                precioVenta: venta,
                stockKg: (existente.stockKg || 0) + cant
            });
        } else {
            agregarProducto({
                nombre: manualNombre.trim(),
                costoPromedio: costo,
                precioVenta: venta,
                unidad: manualUnidad as any,
                stockKg: cant,
                destacadoHoy: true
            });
        }

        // Reset
        setManualNombre('');
        setManualCosto('');
        setManualVenta('');
        setShowManualModal(false);
    };

    return (
        <motion.div
            className="space-y-6 max-w-[1400px] mx-auto pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header with Camera AI Scanner Button & Manual Add */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        Compras & Registro de Notas
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Escanéale la nota de remisión en papel a tu proveedor o agrega renglones faltantes manualmente
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setShowManualModal(true)}
                        variant="outline"
                        className="rounded-2xl h-11 px-4 gap-1.5 text-xs font-bold border-emerald-500 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 shadow-xs"
                    >
                        <Plus size={16} />
                        <span>Agregar Compra Manual</span>
                    </Button>

                    <Button
                        onClick={() => setShowScanner(true)}
                        className="rounded-2xl h-11 px-5 gap-2 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                    >
                        <Camera size={18} />
                        <span>Escanear Nota de Papel con IA</span>
                    </Button>
                </div>
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
                                <p className="text-xs font-semibold text-gray-500">Inversión Total Compras ($)</p>
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
                                <p className="text-xs font-semibold text-gray-500">Renglones Registrados</p>
                                <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{compras.length} artículos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-gray-800 shadow-xs bg-gradient-to-br from-amber-50/50 to-orange-50/30">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Ganancia Esperada Proyectada</p>
                                <p className="text-xl font-black text-amber-950">{formatearMoneda(totalGananciaProyectada)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RECHARTS DAILY EXPENDITURE CHART */}
            <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                <span>Gastos Diarios en Compras de Verduras ($)</span>
                            </h3>
                            <p className="text-xs text-gray-500">Inversión calculada a partir de las notas de remisión escaneadas</p>
                        </div>
                        <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                            Gráfica por Fecha
                        </span>
                    </div>

                    <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyChartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    formatter={(value: any) => [`$${Number(value).toFixed(2)} MXN`, 'Inversión Día']}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Purchases Table with IMPORTE & Projected Profit Columns */}
            <Card className="border border-slate-200 dark:border-gray-800 shadow-xs">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span>Historial Completo de Compras & Proyección de Ganancias</span>
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 uppercase font-semibold">
                                    <th className="text-left py-3 px-2">Fecha</th>
                                    <th className="text-left py-3 px-2">Producto / Artículo</th>
                                    <th className="text-right py-3 px-2">Cantidad</th>
                                    <th className="text-right py-3 px-2 text-emerald-700">Costo Compra ($ Prov.)</th>
                                    <th className="text-right py-3 px-2 text-blue-700">Venta Púb. (Tinta Azul)</th>
                                    <th className="text-right py-3 px-2 text-slate-900 font-extrabold">Importe Compra ($)</th>
                                    <th className="text-right py-3 px-2 text-amber-700 font-black">Ganancia Est. ($)</th>
                                    <th className="text-left py-3 px-2 hidden md:table-cell">Origen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compras.map((c) => {
                                    const gananciaRow = Math.max(0, c.precioVenta - c.precio) * c.cantidad;

                                    return (
                                        <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-3 px-2 text-gray-600">{c.fecha}</td>
                                            <td className="py-3 px-2 font-bold text-gray-900 dark:text-gray-100">{c.producto}</td>
                                            <td className="py-3 px-2 text-right text-gray-700 font-semibold">{c.cantidad} {c.unidad || 'kg'}</td>
                                            <td className="py-3 px-2 text-right text-emerald-700 font-bold">{formatearMoneda(c.precio)}</td>
                                            <td className="py-3 px-2 text-right text-blue-700 font-bold">{formatearMoneda(c.precioVenta)}</td>
                                            <td className="py-3 px-2 text-right font-black text-slate-900 dark:text-gray-100 bg-slate-50/50 dark:bg-gray-800/50">{formatearMoneda(c.totalImporte)}</td>
                                            <td className="py-3 px-2 text-right font-black text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20">+{formatearMoneda(gananciaRow)}</td>
                                            <td className="py-3 px-2 text-gray-500 hidden md:table-cell text-[11px] font-medium">{c.proveedor}</td>
                                        </tr>
                                    );
                                })}
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

            {/* Manual Add Purchase Dialog */}
            <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
                <DialogContent className="sm:max-w-[450px] rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base font-extrabold flex items-center gap-2 text-slate-900">
                            <Plus className="w-5 h-5 text-emerald-600" />
                            <span>Agregar Compra Faltante Manual</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAgregarCompraManual} className="space-y-3.5 pt-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Producto *</label>
                            <Input
                                required
                                placeholder="Ej: Champaña / Chayote"
                                value={manualNombre}
                                onChange={e => setManualNombre(e.target.value)}
                                className="rounded-xl text-xs"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad *</label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    required
                                    value={manualCantidad}
                                    onChange={e => setManualCantidad(e.target.value)}
                                    className="rounded-xl text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Unidad</label>
                                <select
                                    value={manualUnidad}
                                    onChange={e => setManualUnidad(e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                                >
                                    <option value="kg">kg (Kilos)</option>
                                    <option value="unidad">unidad (Piezas)</option>
                                    <option value="atado">atado</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-blue-700 mb-1">Costo Prov. (Azul) *</label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    required
                                    placeholder="$ Costo"
                                    value={manualCosto}
                                    onChange={e => setManualCosto(e.target.value)}
                                    className="rounded-xl text-xs border-blue-300 bg-blue-50/50 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-emerald-700 mb-1">Venta Púb. ($ Negra)</label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    placeholder="$ Venta"
                                    value={manualVenta}
                                    onChange={e => setManualVenta(e.target.value)}
                                    className="rounded-xl text-xs border-emerald-300 bg-emerald-50/50 font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Nota</label>
                            <Input
                                type="text"
                                value={manualFecha}
                                onChange={e => setManualFecha(e.target.value)}
                                className="rounded-xl text-xs font-mono"
                            />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowManualModal(false)} className="rounded-xl text-xs">
                                Cancelar
                            </Button>
                            <Button type="submit" className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                                Guardar Compra
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
