import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils';
import Dashboard from './Dashboard';

describe('Dashboard - Integracion', () => {
  it('renderiza titulo dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('muestra metricas principales', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Ganancia de Hoy/i)).toBeInTheDocument();
    expect(screen.getByText(/Ganancia Semana/i)).toBeInTheDocument();
    expect(screen.getByText(/Margen Promedio/i)).toBeInTheDocument();
  });

  it('muestra tabla productos', () => {
    render(<Dashboard />);
    const productos = screen.getAllByText('Productos');
    expect(productos.length).toBeGreaterThanOrEqual(1);
    const tomates = screen.getAllByText('Tomates');
    expect(tomates.length).toBeGreaterThanOrEqual(1);
    const lechugas = screen.getAllByText('Lechugas');
    expect(lechugas.length).toBeGreaterThanOrEqual(1);
  });

  it('muestra recomendaciones', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Recomendaciones para Hoy/i)).toBeInTheDocument();
  });
});
