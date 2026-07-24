import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface Producto {
    id: string;
    nombre: string;
    costoPromedio: number; // costo por kg o pieza
    precioVenta: number;   // precio de venta público
    unidad: 'kg' | 'unidad' | 'atado';
    imagenUrl?: string;    // Foto del día o catálogo
    categoria?: 'Verduras' | 'Frutas' | 'Abarrotes' | 'Limpieza' | 'Chiles' | 'Tubérculos' | 'Semillas';
    stockKg?: number;      // Stock en kg o piezas
    destacadoHoy?: boolean;
    mermaAcumuladaKg?: number;
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

const STORAGE_KEY = 'verduras-pro-productos-v3';
const WAS_CLEARED_KEY = 'verduras-pro-was-cleared-v3';
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://192.168.1.149:3001';

const productosIniciales: Producto[] = [
    // --- VERDURAS & FRUTAS ---
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
        nombre: 'Aguacate Hass Maduro',
        costoPromedio: 45.00,
        precioVenta: 72.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
        categoria: 'Frutas',
        stockKg: 35,
        destacadoHoy: true,
        mermaAcumuladaKg: 2
    },
    {
        id: '4',
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
        id: '5',
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

    // --- ABARROTES & DULCES ---
    {
        id: '101',
        nombre: 'Sopa de Pasta La Moderna 200g',
        costoPromedio: 7.50,
        precioVenta: 11.50,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281864?auto=format&fit=crop&w=600&q=80',
        categoria: 'Abarrotes',
        stockKg: 50,
        destacadoHoy: true,
        mermaAcumuladaKg: 0
    },
    {
        id: '102',
        nombre: 'Chocolate Abuelita Tablilla 540g',
        costoPromedio: 62.00,
        precioVenta: 85.00,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
        categoria: 'Abarrotes',
        stockKg: 20,
        destacadoHoy: true,
        mermaAcumuladaKg: 0
    },
    {
        id: '103',
        nombre: 'Aceite Vegetal de Cocina 1L',
        costoPromedio: 28.00,
        precioVenta: 39.00,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
        categoria: 'Abarrotes',
        stockKg: 30,
        destacadoHoy: false,
        mermaAcumuladaKg: 0
    },
    {
        id: '104',
        nombre: 'Frijol Negro Seleccionado 1kg',
        costoPromedio: 24.00,
        precioVenta: 34.00,
        unidad: 'kg',
        imagenUrl: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=600&q=80',
        categoria: 'Abarrotes',
        stockKg: 40,
        destacadoHoy: true,
        mermaAcumuladaKg: 0
    },

    // --- LIMPIEZA & JABONES ---
    {
        id: '201',
        nombre: 'Limpiador Fabuloso Lavanda 1L',
        costoPromedio: 20.00,
        precioVenta: 29.00,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',
        categoria: 'Limpieza',
        stockKg: 25,
        destacadoHoy: true,
        mermaAcumuladaKg: 0
    },
    {
        id: '202',
        nombre: 'Jabón Zote Blanco 400g',
        costoPromedio: 16.00,
        precioVenta: 24.00,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1607006482602-53896561f52b?auto=format&fit=crop&w=600&q=80',
        categoria: 'Limpieza',
        stockKg: 35,
        destacadoHoy: true,
        mermaAcumuladaKg: 0
    }
];

function loadProductosLocal(): Producto[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch { /* ignore */ }
    return productosIniciales;
}

export function ProductosProvider({ children }: { children: ReactNode }) {
    const [productos, setProductos] = useState<Producto[]>(loadProductosLocal);

    // Sync with SQLite backend on server 192.168.1.149:3001
    const syncFromSQLiteServer = useCallback(async () => {
        try {
            const wasCleared = localStorage.getItem(WAS_CLEARED_KEY);
            if (wasCleared === 'true') return;

            const res = await fetch(`${SERVER_URL}/api/productos`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProductos(data);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                }
            }
        } catch {
            // Server offline fallback to local cache
        }
    }, []);

    useEffect(() => {
        syncFromSQLiteServer();
    }, [syncFromSQLiteServer]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
    }, [productos]);

    const agregarProducto = useCallback(async (nuevo: Omit<Producto, 'id'>) => {
        localStorage.removeItem(WAS_CLEARED_KEY);
        const prodId = `p-${Date.now()}`;
        const completo: Producto = {
            ...nuevo,
            id: prodId,
            categoria: nuevo.categoria || 'Abarrotes',
            mermaAcumuladaKg: nuevo.mermaAcumuladaKg || 0,
            destacadoHoy: nuevo.destacadoHoy ?? true
        };

        setProductos(prev => [...prev, completo]);

        // Post to SQLite server
        try {
            await fetch(`${SERVER_URL}/api/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completo)
            });
        } catch { /* ignore */ }
    }, []);

    const editarProducto = useCallback(async (id: string, cambios: Partial<Producto>) => {
        setProductos(prev =>
            prev.map(p => p.id === id ? { ...p, ...cambios } : p)
        );

        // Put to SQLite server
        try {
            await fetch(`${SERVER_URL}/api/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cambios)
            });
        } catch { /* ignore */ }
    }, []);

    const eliminarProducto = useCallback(async (id: string) => {
        setProductos(prev => prev.filter(p => p.id !== id));

        // Delete from SQLite server
        try {
            await fetch(`${SERVER_URL}/api/productos/${id}`, {
                method: 'DELETE'
            });
        } catch { /* ignore */ }
    }, []);

    const registrarMerma = useCallback((id: string, kgMerma: number) => {
        setProductos(prev =>
            prev.map(p => {
                if (p.id === id) {
                    const actualMerma = p.mermaAcumuladaKg || 0;
                    const nuevoStock = Math.max(0, (p.stockKg || 0) - kgMerma);
                    const actualizado = {
                        ...p,
                        mermaAcumuladaKg: actualMerma + kgMerma,
                        stockKg: nuevoStock
                    };

                    fetch(`${SERVER_URL}/api/productos/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mermaAcumuladaKg: actualizado.mermaAcumuladaKg, stockKg: actualizado.stockKg })
                    }).catch(() => {});

                    return actualizado;
                }
                return p;
            })
        );
    }, []);

    const borrarTodo = useCallback(() => {
        setProductos([]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        localStorage.setItem(WAS_CLEARED_KEY, 'true');

        // Delete all tables from SQLite server
        fetch(`${SERVER_URL}/api/reset`, {
            method: 'DELETE'
        }).catch(() => {});
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
