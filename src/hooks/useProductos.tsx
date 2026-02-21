import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface Producto {
    id: string;
    nombre: string;
    costoPromedio: number; // costo por kg
}

interface ProductosContextType {
    productos: Producto[];
    agregarProducto: (nombre: string, costo: number) => void;
    editarProducto: (id: string, nombre: string, costo: number) => void;
    eliminarProducto: (id: string) => void;
    borrarTodo: () => void;
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

const STORAGE_KEY = 'verduras-pro-productos';
const NEXT_ID_KEY = 'verduras-pro-next-id';

// Productos iniciales de ejemplo
const productosIniciales: Producto[] = [
    { id: '1', nombre: 'Tomates', costoPromedio: 2.00 },
    { id: '2', nombre: 'Papas', costoPromedio: 1.50 },
    { id: '3', nombre: 'Lechugas', costoPromedio: 1.80 },
    { id: '4', nombre: 'Zanahorias', costoPromedio: 1.20 },
    { id: '5', nombre: 'Cebollas', costoPromedio: 1.40 },
    { id: '6', nombre: 'Chiles', costoPromedio: 3.00 },
    { id: '7', nombre: 'Calabazas', costoPromedio: 1.60 },
    { id: '8', nombre: 'Pimientos', costoPromedio: 4.50 },
    { id: '9', nombre: 'Espinacas', costoPromedio: 2.50 },
];

function loadProductos(): Producto[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return productosIniciales;
}

function loadNextId(): number {
    try {
        const saved = localStorage.getItem(NEXT_ID_KEY);
        if (saved) return parseInt(saved, 10);
    } catch { /* ignore */ }
    return 10;
}

export function ProductosProvider({ children }: { children: ReactNode }) {
    const [productos, setProductos] = useState<Producto[]>(loadProductos);
    const [nextId, setNextId] = useState(loadNextId);

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
    }, [productos]);

    useEffect(() => {
        localStorage.setItem(NEXT_ID_KEY, String(nextId));
    }, [nextId]);

    const agregarProducto = useCallback((nombre: string, costo: number) => {
        setProductos(prev => [...prev, { id: String(nextId), nombre, costoPromedio: costo }]);
        setNextId(prev => prev + 1);
    }, [nextId]);

    const editarProducto = useCallback((id: string, nombre: string, costo: number) => {
        setProductos(prev =>
            prev.map(p => p.id === id ? { ...p, nombre, costoPromedio: costo } : p)
        );
    }, []);

    const eliminarProducto = useCallback((id: string) => {
        setProductos(prev => prev.filter(p => p.id !== id));
    }, []);

    const borrarTodo = useCallback(() => {
        setProductos([]);
        setNextId(1);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(NEXT_ID_KEY);
    }, []);

    return (
        <ProductosContext.Provider value={{ productos, agregarProducto, editarProducto, eliminarProducto, borrarTodo }}>
            {children}
        </ProductosContext.Provider>
    );
}

export function useProductos() {
    const context = useContext(ProductosContext);
    if (!context) {
        throw new Error('useProductos must be used within a ProductosProvider');
    }
    return context;
}
