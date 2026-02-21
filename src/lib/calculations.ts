// Cálculos de negocio para el sistema de verduras

/**
 * Calcula el precio promedio ponderado de compra de un producto
 * @param compras - Array de compras del producto
 * @returns Precio promedio ponderado
 */
export function calcularPrecioCompraPromedio(
    compras: { cantidad: number; precioUnitario: number }[]
): number {
    if (compras.length === 0) return 0;

    const totalGastado = compras.reduce(
        (sum, compra) => sum + compra.cantidad * compra.precioUnitario,
        0
    );
    const totalCantidad = compras.reduce((sum, compra) => sum + compra.cantidad, 0);

    return totalCantidad > 0 ? totalGastado / totalCantidad : 0;
}

/**
 * Calcula el margen de ganancia
 * @param precioVenta - Precio de venta unitario
 * @param precioCompra - Precio de compra unitario
 * @returns Margen de ganancia en porcentaje
 */
export function calcularMargen(precioVenta: number, precioCompra: number): number {
    if (precioVenta === 0) return 0;
    return ((precioVenta - precioCompra) / precioVenta) * 100;
}

/**
 * Calcula la ganancia de una venta
 * @param cantidad - Cantidad vendida
 * @param precioVenta - Precio de venta unitario
 * @param precioCompra - Precio de compra unitario (promedio)
 * @returns Objeto con detalles de la ganancia
 */
export function calcularGananciaVenta(
    cantidad: number,
    precioVenta: number,
    precioCompra: number
): {
    total: number;
    costoTotal: number;
    ganancia: number;
    margen: number;
} {
    const total = cantidad * precioVenta;
    const costoTotal = cantidad * precioCompra;
    const ganancia = total - costoTotal;
    const margen = calcularMargen(precioVenta, precioCompra);

    return {
        total,
        costoTotal,
        ganancia,
        margen,
    };
}

/**
 * Calcula el ROI (Return on Investment)
 * @param ganancia - Ganancia obtenida
 * @param inversion - Inversión realizada
 * @returns ROI en porcentaje
 */
export function calcularROI(ganancia: number, inversion: number): number {
    if (inversion === 0) return 0;
    return (ganancia / inversion) * 100;
}

/**
 * Calcula la velocidad de rotación de un producto
 * @param diasEnStock - Días que el producto ha estado en stock
 * @param cantidadVendida - Cantidad vendida
 * @param cantidadComprada - Cantidad comprada
 * @returns Días de rotación
 */
export function calcularVelocidadRotacion(
    diasEnStock: number,
    cantidadVendida: number,
    cantidadComprada: number
): number {
    if (cantidadComprada === 0 || cantidadVendida === 0) return 0;
    const tasaVenta = cantidadVendida / cantidadComprada;
    return diasEnStock / tasaVenta;
}

/**
 * Formatea un número como moneda
 * @param valor - Valor numérico
 * @param moneda - Código de moneda (default: 'MXN')
 * @returns String formateado como moneda
 */
export function formatearMoneda(valor: number, moneda: string = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: moneda,
    }).format(valor);
}

/**
 * Formatea un porcentaje
 * @param valor - Valor numérico
 * @param decimales - Número de decimales (default: 1)
 * @returns String formateado como porcentaje
 */
export function formatearPorcentaje(valor: number, decimales: number = 1): string {
    return `${valor.toFixed(decimales)}%`;
}
