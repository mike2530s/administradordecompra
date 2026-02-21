import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { DollarSign, Loader2, TrendingUp, TrendingDown, Sparkles, AlertTriangle } from 'lucide-react';
import { formatearMoneda, formatearPorcentaje, calcularGananciaVenta } from '@/lib/calculations';
import { useProductos } from '@/hooks/useProductos';



interface VentaFormProps {
    open: boolean;
    onClose: () => void;
}

interface VentaResult {
    productoNombre: string;
    cantidad: number;
    total: number;
    costoTotal: number;
    ganancia: number;
    margen: number;
}

export default function VentaForm({ open, onClose }: VentaFormProps) {
    const { productos: productosConCosto } = useProductos();
    const [productoId, setProductoId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [cliente, setCliente] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VentaResult | null>(null);

    const producto = productosConCosto.find(p => p.id === productoId);
    const cantidadNum = parseFloat(cantidad) || 0;
    const precioVentaNum = parseFloat(precioVenta) || 0;
    const total = cantidadNum * precioVentaNum;

    const resetForm = () => {
        setProductoId('');
        setCantidad('');
        setPrecioVenta('');
        setFecha(new Date().toISOString().split('T')[0]);
        setCliente('');
        setResult(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!producto) return;

        setLoading(true);

        // Simulate saving to Firestore
        await new Promise(resolve => setTimeout(resolve, 1000));

        const calculo = calcularGananciaVenta(cantidadNum, precioVentaNum, producto.costoPromedio);

        setResult({
            productoNombre: producto.nombre,
            cantidad: cantidadNum,
            total: calculo.total,
            costoTotal: calculo.costoTotal,
            ganancia: calculo.ganancia,
            margen: calculo.margen,
        });

        setLoading(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleNewSale = () => {
        resetForm();
    };

    const isProfit = result ? result.ganancia >= 0 : true;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-2xl overflow-hidden dark:bg-gray-900">
                {/* Header */}
                <div className="p-6 pb-4" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-xl">
                            <DollarSign className="w-6 h-6" />
                            Registrar Venta
                        </DialogTitle>
                        <DialogDescription className="text-emerald-100">
                            Registra una venta y conoce tu ganancia al instante
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-6"
                        >
                            {/* Result card */}
                            <motion.div
                                className={`rounded-2xl p-6 text-center border-2 ${isProfit ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                                    }`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            >
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                                    className="mb-4"
                                >
                                    {isProfit ? (
                                        <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-8 h-8 text-emerald-600" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                            <AlertTriangle className="w-8 h-8 text-red-600" />
                                        </div>
                                    )}
                                </motion.div>

                                <h3 className={`text-lg font-bold mb-3 ${isProfit ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {isProfit ? '✅ VENTA REGISTRADA' : '⚠️ VENTA CON PÉRDIDA'}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <p>Vendiste: <strong>{result.cantidad}kg de {result.productoNombre}</strong></p>
                                    <p>Total cobrado: <strong>{formatearMoneda(result.total)}</strong></p>
                                    <p>Te costó: <strong>{formatearMoneda(result.costoTotal)}</strong></p>
                                </div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className={`text-3xl font-bold flex items-center justify-center gap-2 ${isProfit ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                        {isProfit ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                                        {isProfit ? '¡GANASTE' : 'PERDISTE'} {formatearMoneda(Math.abs(result.ganancia))}!
                                    </div>
                                    <p className={`text-sm font-medium mt-1 ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                                        ({formatearPorcentaje(result.margen)} de margen)
                                    </p>
                                </motion.div>
                            </motion.div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl h-11">
                                    Cerrar
                                </Button>
                                <Button
                                    onClick={handleNewSale}
                                    className="flex-1 rounded-xl h-11"
                                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                                >
                                    Nueva Venta
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 space-y-4"
                        >
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Producto</Label>
                                <Select value={productoId} onValueChange={setProductoId}>
                                    <SelectTrigger className="rounded-xl h-11">
                                        <SelectValue placeholder="Seleccionar producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productosConCosto.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.nombre} (costo: {formatearMoneda(p.costoPromedio)}/kg)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Cantidad (kg)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={cantidad}
                                        onChange={e => setCantidad(e.target.value)}
                                        placeholder="0.0"
                                        required
                                        className="rounded-xl h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Precio venta/kg</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={precioVenta}
                                            onChange={e => setPrecioVenta(e.target.value)}
                                            placeholder="0.00"
                                            required
                                            className="rounded-xl h-11 pl-7"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Auto-calculated total with profit preview */}
                            {total > 0 && producto && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2"
                                >
                                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Total a cobrar</p>
                                        <p className="text-2xl font-bold text-gray-800">{formatearMoneda(total)}</p>
                                    </div>
                                    {/* Profit preview */}
                                    {(() => {
                                        const preview = calcularGananciaVenta(cantidadNum, precioVentaNum, producto.costoPromedio);
                                        const isPreviewProfit = preview.ganancia >= 0;
                                        return (
                                            <div className={`rounded-xl p-3 text-center border ${isPreviewProfit ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
                                                }`}>
                                                <p className="text-xs uppercase font-medium tracking-wide mb-1"
                                                    style={{ color: isPreviewProfit ? '#059669' : '#DC2626' }}>
                                                    Ganancia estimada
                                                </p>
                                                <p className={`text-lg font-bold ${isPreviewProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {isPreviewProfit ? '+' : ''}{formatearMoneda(preview.ganancia)} ({formatearPorcentaje(preview.margen)})
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </motion.div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Fecha</Label>
                                    <Input
                                        type="date"
                                        value={fecha}
                                        onChange={e => setFecha(e.target.value)}
                                        className="rounded-xl h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Cliente (opcional)</Label>
                                    <Input
                                        value={cliente}
                                        onChange={e => setCliente(e.target.value)}
                                        placeholder="Nombre"
                                        className="rounded-xl h-11"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 rounded-xl h-11">
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !productoId || !cantidad || !precioVenta}
                                    className="flex-1 rounded-xl h-11"
                                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Venta'}
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
