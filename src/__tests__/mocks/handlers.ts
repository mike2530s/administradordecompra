import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/api/compras', () => {
    return HttpResponse.json([
      { id: 1, fecha: '13/02/2026', producto: 'Tomates', cantidad: 50, precio: 2.0, total: 100, proveedor: 'Juan Pérez' },
      { id: 2, fecha: '13/02/2026', producto: 'Papas', cantidad: 100, precio: 1.5, total: 150, proveedor: 'María García' },
    ]);
  }),

  http.post('*/api/compras', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ id: 3, ...data }, { status: 201 });
  }),

  http.get('*/api/ventas', () => {
    return HttpResponse.json([
      { id: 1, fecha: '13/02/2026', producto: 'Tomates', cantidad: 20, precio: 5.0, total: 100, cliente: 'Mercado X' },
      { id: 2, fecha: '13/02/2026', producto: 'Papas', cantidad: 30, precio: 4.0, total: 120, cliente: 'Tienda Y' },
    ]);
  }),

  http.post('*/api/ventas', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ id: 3, ...data }, { status: 201 });
  }),

  http.get('*/api/productos', () => {
    return HttpResponse.json([
      { id: 1, nombre: 'Tomates', stock: 25, margen: 45 },
      { id: 2, nombre: 'Papas', stock: 50, margen: 30 },
      { id: 3, nombre: 'Lechugas', stock: 10, margen: 5 },
    ]);
  }),

  http.post('*/api/productos', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ id: 4, ...data }, { status: 201 });
  }),
];
