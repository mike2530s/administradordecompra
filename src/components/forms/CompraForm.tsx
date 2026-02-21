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
import { ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import { formatearMoneda } from '@/lib/calculations';
import { useProductos } from '@/hooks/useProductos';



interface CompraFormProps {
    open: boolean;
    onClose: () => void;
}

export default function CompraForm({ open, onClose }: CompraFormProps) {
    const { productos: productosExistentes } = useProductos();
    const [productoId, setProductoId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [totalGastado, setTotalGastado] = useState(0);

    const total = (parseFloat(cantidad) || 0) * (parseFloat(precioUnitario) || 0);
    const productoNombre = productosExistentes.find(p => p.id === productoId)?.nombre || '';

    const resetForm = () => {
        setProductoId('');
        setCantidad('');
        setPrecioUnitario('');
        setProveedor('');
        setFecha(new Date().toISOString().split('T')[0]);
        setNotas('');
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate saving to Firestore
        await new Promise(resolve => setTimeout(resolve, 1000));

        setTotalGastado(total);
        setSuccess(true);
        setLoading(false);

        // Auto reset after 2 seconds
        setTimeout(() => {
            resetForm();
        }, 3000);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-2xl overflow-hidden dark:bg-gray-900">
                {/* Header with gradient */}
                <div className="p-6 pb-4" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-xl">
                            <ShoppingCart className="w-6 h-6" />
                            Registrar Compra
                        </DialogTitle>
                        <DialogDescription className="text-blue-100">
                            Registra una nueva compra al proveedor
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">✅ Compra Registrada</h3>
                            <p className="text-gray-600 mb-1">
                                Compraste <strong>{cantidad} kg</strong> de <strong>{productoNombre}</strong>
                            </p>
                            <p className="text-2xl font-bold text-blue-600 mt-2">{formatearMoneda(totalGastado)}</p>
                            <p className="text-sm text-gray-500 mt-1">gastado en esta compra</p>
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
                                        {productosExistentes.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
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
                                    <Label className="text-gray-700 font-medium">Precio/kg</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={precioUnitario}
                                            onChange={e => setPrecioUnitario(e.target.value)}
                                            placeholder="0.00"
                                            required
                                            className="rounded-xl h-11 pl-7"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Auto-calculated total */}
                            {total > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100"
                                >
                                    <p className="text-xs text-blue-500 uppercase font-medium tracking-wide">Total a pagar</p>
                                    <p className="text-2xl font-bold text-blue-700">{formatearMoneda(total)}</p>
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Proveedor</Label>
                                <Input
                                    value={proveedor}
                                    onChange={e => setProveedor(e.target.value)}
                                    placeholder="Nombre del proveedor"
                                    required
                                    className="rounded-xl h-11"
                                />
                            </div>

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
                                    <Label className="text-gray-700 font-medium">Notas (opcional)</Label>
                                    <Input
                                        value={notas}
                                        onChange={e => setNotas(e.target.value)}
                                        placeholder="Sin notas"
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
                                    disabled={loading || !productoId || !cantidad || !precioUnitario || !proveedor}
                                    className="flex-1 rounded-xl h-11"
                                    style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Compra'}
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
