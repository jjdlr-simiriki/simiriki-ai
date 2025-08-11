import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWidget from '../app/components/ChatWidget';

describe('ChatWidget', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends message and shows assistant reply', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: 'respuesta' }),
    } as any);

    render(<ChatWidget />);
    const input = screen.getByPlaceholderText('Escribe tu mensaje…');
    await user.type(input, 'hola');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    await screen.findByText('hola');
    await screen.findByText('respuesta');
    expect(global.fetch).toHaveBeenCalled();
  });

  it('shows error message on failed request', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({ ok: false } as any);

    render(<ChatWidget />);
    const input = screen.getByPlaceholderText('Escribe tu mensaje…');
    await user.type(input, 'hola');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    await screen.findByText('Lo siento, ocurrió un error.');
  });
});
