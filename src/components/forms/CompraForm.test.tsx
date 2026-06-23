import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@/__tests__/utils';
import CompraForm from './CompraForm';

describe('CompraForm - Integracion', () => {
  it('renderiza formulario cuando abierto', () => {
    render(<CompraForm open={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Registrar Compra/i)).toBeInTheDocument();
  });

  it('no renderiza formulario cuando cerrado', () => {
    render(<CompraForm open={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/Registrar Compra/i)).not.toBeInTheDocument();
  });

  it('llama onClose al cancelar', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CompraForm open={true} onClose={onClose} />);

    const cancelButton = screen.getByText(/Cancelar/i);
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('boton submit deshabilitado cuando campos vacios', () => {
    render(<CompraForm open={true} onClose={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /Guardar Compra/i });
    expect(submitButton).toBeDisabled();
  });

  it('envia formulario correctamente', async () => {
    const user = userEvent.setup();
    render(<CompraForm open={true} onClose={vi.fn()} />);

    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);

    const option = await screen.findByRole('option', { name: 'Tomates' });
    await user.click(option);

    const cantidadInput = screen.getByPlaceholderText('0.0');
    await user.type(cantidadInput, '50');

    const precioInput = screen.getByPlaceholderText('0.00');
    await user.type(precioInput, '2.00');

    const proveedorInput = screen.getByPlaceholderText('Nombre del proveedor');
    await user.type(proveedorInput, 'Juan Pérez');

    const submitButton = screen.getByRole('button', { name: /Guardar Compra/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Compra Registrada/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
