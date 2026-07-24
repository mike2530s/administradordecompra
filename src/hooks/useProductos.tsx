import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface Producto {
    id: string;
    nombre: string;
    costoPromedio: number; // costo por kg
    precioVenta: number;   // precio de venta público
    unidad: 'kg' | 'unidad' | 'atado';
    imagenUrl?: string;    // Foto del día del servidor o local
    categoria?: string;
    stockKg?: number;
    destacadoHoy?: boolean;
    mermaAcumuladaKg?: number; // Kg echados a perder/merma
}

interface ProductosContextType {
    productos: Producto[];
    agregarProducto: (producto: Omit<Producto, 'id'>) => void;
    editarProducto: (id: string, producto: Partial<Producto>) => void;
    eliminarProducto: (id: string) => void;
    registrarMerma: (id: string, kgMerma: number) => void;
    borrarTodo: () => void;
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

const STORAGE_KEY = 'verduras-pro-productos-v2';
const NEXT_ID_KEY = 'verduras-pro-next-id-v2';

// Productos iniciales con fotos hermosas por defecto
const productosIniciales: Producto[] = [
    {
        id: '1',
        nombre: 'Tomate Bola Fresco',
        costoPromedio: 15.00,
        precioVenta: 24.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        categoria: 'Verduras',
        stockKg: 45,
        destacadoHoy: true,
        mermaAcumuladaKg: 2
    },
    {
        id: '2',
        nombre: 'Papa Blanca Seleccionada',
        costoPromedio: 12.00,
        precioVenta: 20.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
        categoria: 'Tubérculos',
        stockKg: 60,
        destacadoHoy: true,
        mermaAcumuladaKg: 1
    },
    {
        id: '3',
        nombre: 'Lechuga Orejona Orgánica',
        costoPromedio: 10.00,
        precioVenta: 18.00,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
        categoria: 'Verduras de Hoja',
        stockKg: 25,
        destacadoHoy: true,
        mermaAcumuladaKg: 3
    },
    {
        id: '4',
        nombre: 'Zanahoria Dulce de Campo',
        costoPromedio: 9.00,
        precioVenta: 16.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?auto=format&fit=crop&w=600&q=80',
        categoria: 'Verduras',
        stockKg: 30,
        destacadoHoy: false,
        mermaAcumuladaKg: 0
    },
    {
        id: '5',
        nombre: 'Cebolla Morada Premium',
        costoPromedio: 14.00,
        precioVenta: 25.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
        categoria: 'Verduras',
        stockKg: 40,
        destacadoHoy: true,
        mermaAcumuladaKg: 1
    },
    {
        id: '6',
        nombre: 'Chile Serrano Verde',
        costoPromedio: 22.00,
        precioVenta: 38.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
        categoria: 'Chiles',
        stockKg: 15,
        destacadoHoy: false,
        mermaAcumuladaKg: 0.5
    },
    {
        id: '7',
        nombre: 'Calabacita Italiana',
        costoPromedio: 13.00,
        precioVenta: 22.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80',
        categoria: 'Verduras',
        stockKg: 20,
        destacadoHoy: true,
        mermaAcumuladaKg: 1.5
    },
    {
        id: '8',
        nombre: 'Aguacate Hass Maduro',
        costoPromedio: 45.00,
        precioVenta: 72.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
        categoria: 'Frutas y Verduras',
        stockKg: 35,
        destacadoHoy: true,
        mermaAcumuladaKg: 2
    }
];

function loadProductos(): Producto[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
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

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
    }, [productos]);

    useEffect(() => {
        localStorage.setItem(NEXT_ID_KEY, String(nextId));
    }, [nextId]);

    const agregarProducto = useCallback((nuevo: Omit<Producto, 'id'>) => {
        setProductos(prev => [
            ...prev,
            {
                ...nuevo,
                id: String(nextId),
                mermaAcumuladaKg: nuevo.mermaAcumuladaKg || 0,
                destacadoHoy: nuevo.destacadoHoy ?? true
            }
        ]);
        setNextId(prev => prev + 1);
    }, [nextId]);

    const editarProducto = useCallback((id: string, cambios: Partial<Producto>) => {
        setProductos(prev =>
            prev.map(p => p.id === id ? { ...p, ...cambios } : p)
        );
    }, []);

    const eliminarProducto = useCallback((id: string) => {
        setProductos(prev => prev.filter(p => p.id !== id));
    }, []);

    const registrarMerma = useCallback((id: string, kgMerma: number) => {
        setProductos(prev =>
            prev.map(p => {
                if (p.id === id) {
                    const actualMerma = p.mermaAcumuladaKg || 0;
                    const nuevoStock = Math.max(0, (p.stockKg || 0) - kgMerma);
                    return {
                        ...p,
                        mermaAcumuladaKg: actualMerma + kgMerma,
                        stockKg: nuevoStock
                    };
                }
                return p;
            })
        );
    }, []);

    const borrarTodo = useCallback(() => {
        setProductos(productosIniciales);
        setNextId(10);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(NEXT_ID_KEY);
    }, []);

    return (
        <ProductosContext.Provider value={{ productos, agregarProducto, editarProducto, eliminarProducto, registrarMerma, borrarTodo }}>
            {children}
        </ProductosContext.Provider>
    );
}

export function useProductos() {
    const context = useContext(ProductosContext);
    if (!context) {
        throw new Error('useProductos debe usarse dentro de ProductosProvider');
    }
    return context;
}
