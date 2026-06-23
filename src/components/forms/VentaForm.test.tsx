import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, fireEvent } from '@/__tests__/utils';
import VentaForm from './VentaForm';

describe('VentaForm - Integracion', () => {
  it('renderiza formulario cuando abierto', () => {
    render(<VentaForm open={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Registrar Venta/i)).toBeInTheDocument();
  });

  it('no renderiza formulario cuando cerrado', () => {
    render(<VentaForm open={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/Registrar Venta/i)).not.toBeInTheDocument();
  });

  it('llama onClose al cancelar', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<VentaForm open={true} onClose={onClose} />);

    const cancelButton = screen.getByText(/Cancelar/i);
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('boton submit deshabilitado cuando campos vacios', () => {
    render(<VentaForm open={true} onClose={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /Guardar Venta/i });
    expect(submitButton).toBeDisabled();
  });

  it('envia venta y muestra resultado', async () => {
    const user = userEvent.setup();
    render(<VentaForm open={true} onClose={vi.fn()} />);

    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);

    const option = await screen.findByRole('option', { name: /Tomates/ });
    await user.click(option);

    const cantidadInput = screen.getByPlaceholderText('0.0');
    await user.type(cantidadInput, '10');

    const precioInput = screen.getByPlaceholderText('0.00');
    await user.type(precioInput, '5.00');

    const submitButton = screen.getByRole('button', { name: /Guardar Venta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/VENTA REGISTRADA/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
