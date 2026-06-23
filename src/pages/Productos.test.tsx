import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';
import Productos from './Productos';

describe('Pagina Productos - Integracion', () => {
  it('renderiza titulo productos', () => {
    render(<Productos />);
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  it('muestra productos del provider', () => {
    render(<Productos />);
    expect(screen.getByText('Tomates')).toBeInTheDocument();
    expect(screen.getByText('Papas')).toBeInTheDocument();
    expect(screen.getByText('Lechugas')).toBeInTheDocument();
  });

  it('muestra contador productos', () => {
    render(<Productos />);
    expect(screen.getByText(/9 productos registrados/i)).toBeInTheDocument();
  });

  it('filtra productos por busqueda', async () => {
    const user = userEvent.setup();
    render(<Productos />);

    const searchInput = screen.getByPlaceholderText('Buscar producto...');
    await user.type(searchInput, 'Tomates');

    expect(screen.getByDisplayValue('Tomates')).toBeInTheDocument();
    expect(screen.getByText('Tomates')).toBeInTheDocument();
  });
});
