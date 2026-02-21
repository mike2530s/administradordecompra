import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductos } from '@/hooks/useProductos';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Package, Search, DollarSign } from 'lucide-react';
import { formatearMoneda } from '@/lib/calculations';

export default function Productos() {
    const { productos, agregarProducto, editarProducto, eliminarProducto } = useProductos();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setNombre('');
        setCosto('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (id: string) => {
        const p = productos.find(x => x.id === id);
        if (p) {
            setNombre(p.nombre);
            setCosto(String(p.costoPromedio));
            setEditingId(id);
            setShowForm(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !costo) return;

        if (editingId) {
            editarProducto(editingId, nombre.trim(), parseFloat(costo));
        } else {
            agregarProducto(nombre.trim(), parseFloat(costo));
        }
        resetForm();
    };

    const handleDelete = (id: string) => {
        eliminarProducto(id);
        setDeleteConfirm(null);
    };

    return (
        <motion.div
            className="space-y-4 max-w-[600px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Productos</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{productos.length} productos registrados</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="rounded-xl h-10 px-4 gap-2 text-sm"
                    style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}
                >
                    <Plus size={18} />
                    Agregar
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar producto..."
                    className="pl-10 rounded-xl h-11 dark:bg-gray-900 dark:border-gray-800"
                />
            </div>

            {/* Product list */}
            <div className="space-y-2">
                <AnimatePresence>
                    {filtered.map((p) => (
                        <motion.div
                            key={p.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center">
                                                <Package size={20} className="text-green-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{p.nombre}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <DollarSign size={12} />
                                                    Costo: {formatearMoneda(p.costoPromedio)}/kg
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(p.id)}
                                                className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(p.id)}
                                                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-600 transition-colors"
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

            {/* Add/Edit Form Dialog */}
            <Dialog open={showForm} onOpenChange={() => resetForm()}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl p-0 gap-0 dark:bg-gray-900">
                    <div className="p-5" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}>
                        <DialogHeader>
                            <DialogTitle className="text-white text-lg">
                                {editingId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Nombre del producto</Label>
                            <Input
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                placeholder="Ej: Brócoli"
                                required
                                className="rounded-xl h-11 dark:bg-gray-800 dark:border-gray-700"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Costo promedio por kg</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={costo}
                                    onChange={e => setCosto(e.target.value)}
                                    placeholder="0.00"
                                    required
                                    className="rounded-xl h-11 pl-7 dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-1">
                            <Button type="button" variant="outline" onClick={resetForm} className="flex-1 rounded-xl h-11 dark:border-gray-700">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 rounded-xl h-11"
                                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}
                            >
                                {editingId ? 'Guardar' : 'Agregar'}
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
                        Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-3 mt-2">
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl dark:border-gray-700">
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
