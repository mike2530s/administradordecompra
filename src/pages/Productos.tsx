import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductos, type Producto } from '@/hooks/useProductos';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Package, Search, Camera, AlertTriangle, Sparkles } from 'lucide-react';
import { formatearMoneda } from '@/lib/calculations';
import ImageUploader from '@/components/ImageUploader';

export default function Productos() {
    const { productos, agregarProducto, editarProducto, eliminarProducto, registrarMerma } = useProductos();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [unidad, setUnidad] = useState<'kg' | 'unidad' | 'atado'>('kg');
    const [imagenUrl, setImagenUrl] = useState('');
    const [categoria, setCategoria] = useState<Producto['categoria']>('Verduras');
    const [stockKg, setStockKg] = useState('20');
    const [destacadoHoy, setDestacadoHoy] = useState(true);

    // Merma modal state
    const [mermaId, setMermaId] = useState<string | null>(null);
    const [kgMermaInput, setKgMermaInput] = useState('');
    
    // Delete state
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.categoria && p.categoria.toLowerCase().includes(search.toLowerCase()))
    );

    const resetForm = () => {
        setNombre('');
        setCosto('');
        setPrecioVenta('');
        setUnidad('kg');
        setImagenUrl('');
        setCategoria('Verduras');
        setStockKg('20');
        setDestacadoHoy(true);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (p: Producto) => {
        setNombre(p.nombre);
        setCosto(String(p.costoPromedio));
        setPrecioVenta(String(p.precioVenta || p.costoPromedio * 1.5));
        setUnidad(p.unidad || 'kg');
        setImagenUrl(p.imagenUrl || '');
        setCategoria(p.categoria || 'Verduras');
        setStockKg(String(p.stockKg ?? 20));
        setDestacadoHoy(p.destacadoHoy ?? true);
        setEditingId(p.id);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !costo || !precioVenta) return;

        const pData = {
            nombre: nombre.trim(),
            costoPromedio: parseFloat(costo),
            precioVenta: parseFloat(precioVenta),
            unidad,
            imagenUrl,
            categoria,
            stockKg: parseFloat(stockKg) || 0,
            destacadoHoy
        };

        if (editingId) {
            editarProducto(editingId, pData);
        } else {
            agregarProducto(pData);
        }
        resetForm();
    };

    const handleRegistrarMermaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mermaId || !kgMermaInput) return;
        const kg = parseFloat(kgMermaInput);
        if (kg > 0) {
            registrarMerma(mermaId, kg);
        }
        setMermaId(null);
        setKgMermaInput('');
    };

    const handleDelete = (id: string) => {
        eliminarProducto(id);
        setDeleteConfirm(null);
    };

    return (
        <motion.div
            className="space-y-4 max-w-[750px] mx-auto pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        Catálogo & Fotos del Día
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            Servidor 192.168.1.149
                        </span>
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Sube las fotos frescas y administra precios de tus productos
                    </p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="rounded-xl h-10 px-4 gap-2 text-sm text-white font-bold"
                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                >
                    <Plus size={18} />
                    Nuevo Producto
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar producto o categoría..."
                    className="pl-10 rounded-xl h-11 dark:bg-gray-900 dark:border-gray-800"
                />
            </div>

            {/* Product Grid / List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {filtered.map((p) => (
                        <motion.div
                            key={p.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <Card className="border border-slate-200 dark:border-gray-800 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden dark:bg-gray-900">
                                <CardContent className="p-3 sm:p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        {/* Image & Main Info */}
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                                {p.imagenUrl ? (
                                                    <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <Camera size={24} />
                                                    </div>
                                                )}
                                                {p.destacadoHoy && (
                                                    <span className="absolute top-1 left-1 bg-emerald-500 text-white p-0.5 rounded-full shadow-xs" title="Foto de Hoy">
                                                        <Sparkles size={10} />
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{p.nombre}</p>
                                                    <span className="text-[10px] bg-slate-100 dark:bg-gray-800 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                                        {p.categoria || 'Verduras'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <span className="text-emerald-600 font-bold">
                                                        Venta: {formatearMoneda(p.precioVenta)} / {p.unidad}
                                                    </span>
                                                    <span>•</span>
                                                    <span>Costo: {formatearMoneda(p.costoPromedio)}</span>
                                                    <span>•</span>
                                                    <span>Stock: {p.stockKg ?? 0} {p.unidad}s</span>
                                                </div>
                                                {(p.mermaAcumuladaKg ?? 0) > 0 && (
                                                    <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
                                                        <AlertTriangle size={12} /> Merma/Pérdida acumulada: {p.mermaAcumuladaKg} kg
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setMermaId(p.id); setKgMermaInput(''); }}
                                                className="h-8 text-xs font-semibold rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50"
                                                title="Registrar verdura echada a perder"
                                            >
                                                <AlertTriangle size={14} className="mr-1" /> Merma
                                            </Button>

                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950 text-gray-400 hover:text-emerald-600 transition-colors"
                                                title="Editar producto o foto"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(p.id)}
                                                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <Package size={48} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-400 dark:text-gray-500 text-sm">No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Add / Edit Dialog with ImageUploader */}
            <Dialog open={showForm} onOpenChange={() => resetForm()}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 gap-0 dark:bg-gray-900 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white text-base font-bold flex items-center gap-2">
                                {editingId ? (
                                    <>
                                        <Edit2 size={18} /> Editar Producto & Foto
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} /> Nuevo Producto Fresco
                                    </>
                                )}
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                        {/* Image Uploader to ThinkPad T410 server */}
                        <ImageUploader
                            currentImageUrl={imagenUrl}
                            onImageUploaded={(url) => setImagenUrl(url)}
                            label="Foto del Día (Subir a 192.168.1.149)"
                        />

                        <div className="space-y-1.5">
                            <Label className="text-gray-700 dark:text-gray-300 font-semibold text-xs">Nombre de la Verdura</Label>
                            <Input
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                placeholder="Ej: Tomate Bola Fresco"
                                required
                                className="rounded-xl h-10 text-xs dark:bg-gray-800"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-gray-700 dark:text-gray-300 font-semibold text-xs">Precio Venta (Público)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                    <Input
                                        type="number"
                                        step="0.50"
                                        value={precioVenta}
                                        onChange={e => setPrecioVenta(e.target.value)}
                                        placeholder="24.00"
                                        required
                                        className="rounded-xl h-10 text-xs pl-7 dark:bg-gray-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 dark:text-gray-300 font-semibold text-xs">Costo Compra (Inversión)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                    <Input
                                        type="number"
                                        step="0.50"
                                        value={costo}
                                        onChange={e => setCosto(e.target.value)}
                                        placeholder="15.00"
                                        required
                                        className="rounded-xl h-10 text-xs pl-7 dark:bg-gray-800"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-gray-700 dark:text-gray-300 font-semibold text-xs">Unidad de Medida</Label>
                                <select
                                    value={unidad}
                                    onChange={e => setUnidad(e.target.value as any)}
                                    className="w-full h-10 text-xs px-3 rounded-xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <option value="kg">Por Kilo (kg)</option>
                                    <option value="unidad">Por Pieza / Unidad</option>
                                    <option value="atado">Por Atado / Manojo</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 dark:text-gray-300 font-semibold text-xs">Stock Disponible</Label>
                                <Input
                                    type="number"
                                    value={stockKg}
                                    onChange={e => setStockKg(e.target.value)}
                                    placeholder="20"
                                    className="rounded-xl h-10 text-xs dark:bg-gray-800"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                            <input
                                type="checkbox"
                                id="destacado"
                                checked={destacadoHoy}
                                onChange={e => setDestacadoHoy(e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                            />
                            <label htmlFor="destacado" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                Destacar como "Foto del Día" en el formulario de clientes
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={resetForm} className="flex-1 rounded-xl h-10 text-xs">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 rounded-xl h-10 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            >
                                {editingId ? 'Guardar Cambios' : 'Agregar a Catálogo'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Merma / Spoilage Modal */}
            <Dialog open={!!mermaId} onOpenChange={() => setMermaId(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl dark:bg-gray-900">
                    <DialogHeader>
                        <DialogTitle className="text-amber-600 dark:text-amber-400 font-bold text-base flex items-center gap-2">
                            <AlertTriangle size={18} /> Registrar Merma / Verdura Desperdiciada
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRegistrarMermaSubmit} className="space-y-4 pt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Indica cuántos kg o piezas se echaron a perder para restarlos del stock y registrarlos en el cálculo de <strong>pérdidas financieras</strong>.
                        </p>
                        <div>
                            <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Cantidad en kg o piezas echadas a perder:
                            </Label>
                            <Input
                                type="number"
                                step="0.1"
                                required
                                value={kgMermaInput}
                                onChange={e => setKgMermaInput(e.target.value)}
                                placeholder="Ej: 1.5"
                                className="rounded-xl h-10 text-xs mt-1 dark:bg-gray-800"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setMermaId(null)} className="flex-1 rounded-xl h-10 text-xs">
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1 rounded-xl h-10 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold">
                                Registrar Pérdida
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-[350px] rounded-2xl dark:bg-gray-900">
                    <DialogHeader>
                        <DialogTitle className="text-center dark:text-gray-100">¿Eliminar producto?</DialogTitle>
                    </DialogHeader>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Se eliminará <strong>{productos.find(p => p.id === deleteConfirm)?.nombre}</strong> de la lista.
                    </p>
                    <div className="flex gap-3 mt-2">
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl dark:border-gray-700">
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                        >
                            Eliminar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
