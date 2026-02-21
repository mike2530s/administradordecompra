import { Timestamp } from 'firebase/firestore';

// Producto
export interface Producto {
    id: string;
    nombre: string;
    categoria?: string;
    unidad: 'kg' | 'unidad' | 'atado';
    precioCompraPromedio: number;
    precioVentaPromedio: number;
    stockActual: number;
    activo: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Compra
export interface Compra {
    id: string;
    productoId: string;
    productoNombre: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
    proveedor: string;
    fecha: Timestamp;
    notas?: string;
    userId: string;
    createdAt: Timestamp;
}

// Venta
export interface Venta {
    id: string;
    productoId: string;
    productoNombre: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
    costoUnitario: number;
    costoTotal: number;
    ganancia: number;
    margen: number;
    cliente?: string;
    fecha: Timestamp;
    userId: string;
    createdAt: Timestamp;
}

// Inventario
export interface Inventario {
    id: string;
    productoId: string;
    stockActual: number;
    valorInventario: number;
    ultimaCompra?: Timestamp;
    ultimaVenta?: Timestamp;
    updatedAt: Timestamp;
}

// Usuario
export interface Usuario {
    uid: string;
    nombre: string;
    negocio: string;
    email: string;
    createdAt: Timestamp;
    configuracion: {
        moneda: string;
        notificaciones: boolean;
    };
}

// Métricas del Dashboard
export interface Metricas {
    gananciaHoy: number;
    gananciaSemana: number;
    gananciaMes: number;
    margenPromedio: number;
    mejorProducto: {
        nombre: string;
        margen: number;
    };
    peorProducto: {
        nombre: string;
        margen: number;
    };
    inventarioActual: number;
}

// Form Data Types
export interface CompraFormData {
    productoId: string;
    cantidad: number;
    precioUnitario: number;
    proveedor: string;
    fecha: Date;
    notas?: string;
}

export interface VentaFormData {
    productoId: string;
    cantidad: number;
    precioUnitario: number;
    cliente?: string;
    fecha: Date;
}

export interface ProductoFormData {
    nombre: string;
    categoria?: string;
    unidad: 'kg' | 'unidad' | 'atado';
}
