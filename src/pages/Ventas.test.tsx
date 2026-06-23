import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils';
import Ventas from './Ventas';

describe('Pagina Ventas - Integracion', () => {
  it('renderiza titulo ventas', () => {
    render(<Ventas />);
    expect(screen.getByText('Ventas')).toBeInTheDocument();
  });

  it('muestra tarjetas resumen', () => {
    render(<Ventas />);
    expect(screen.getByText(/Vendido Hoy/i)).toBeInTheDocument();
    expect(screen.getByText(/Vendido esta Semana/i)).toBeInTheDocument();
    expect(screen.getByText(/Margen Promedio/i)).toBeInTheDocument();
  });

  it('muestra tabla ventas recientes con datos hardcoded', () => {
    render(<Ventas />);
    const tomates = screen.getAllByText('Tomates');
    expect(tomates.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Papas')).toBeInTheDocument();
    expect(screen.getByText('Zanahorias')).toBeInTheDocument();
  });
});
