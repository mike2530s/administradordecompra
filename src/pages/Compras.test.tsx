import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils';
import Compras from './Compras';

describe('Pagina Compras - Integracion', () => {
  it('renderiza titulo compras', () => {
    render(<Compras />);
    expect(screen.getByText('Compras')).toBeInTheDocument();
  });

  it('muestra tarjetas resumen', () => {
    render(<Compras />);
    expect(screen.getByText(/Compras Hoy/i)).toBeInTheDocument();
    expect(screen.getByText(/Compras esta Semana/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos Comprados/i)).toBeInTheDocument();
  });

  it('muestra tabla compras recientes con datos hardcoded', () => {
    render(<Compras />);
    expect(screen.getByText('Tomates')).toBeInTheDocument();
    expect(screen.getByText('Papas')).toBeInTheDocument();
    const juan = screen.getAllByText('Juan Pérez');
    expect(juan.length).toBeGreaterThanOrEqual(1);
  });

  it('muestra total hardcoded en resumen', () => {
    render(<Compras />);
    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });
});
