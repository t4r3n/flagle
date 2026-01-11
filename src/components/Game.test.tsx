import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Game } from './Game';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the date
vi.mock('../utils/gameUtils', async () => {
  const actual = await vi.importActual('../utils/gameUtils');
  return {
    ...actual,
    getTodayDateString: () => '2026-01-09',
  };
});

describe('Game', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the flag display', () => {
    render(<Game />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders 4 option buttons', () => {
    render(<Game />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('shows round indicator', () => {
    render(<Game />);

    expect(screen.getByText(/round 1/i)).toBeInTheDocument();
  });

  it('advances to next round when option is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Game />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    // Wait for the feedback delay
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText(/round 2/i)).toBeInTheDocument();
  });

  it('shows result ticks as game progresses', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Game />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    // Wait for the feedback delay
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    const slots = screen.getAllByTestId(/tick-slot/);
    // First slot should have a result icon (SVG)
    expect(slots[0].querySelector('svg')).toBeInTheDocument();
  });

  it('shows GameOver after 5 rounds', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Game />);

    // Click through all 5 rounds
    for (let i = 0; i < 5; i++) {
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      // Wait for the feedback delay
      await act(async () => {
        vi.advanceTimersByTime(1500);
      });
    }

    expect(screen.getByText(/come back tomorrow/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('shows GameOver immediately if already completed today', () => {
    // Pre-populate localStorage with completed game
    const savedGame = {
      date: '2026-01-09',
      results: [
        { correct: true, country: { name: 'T1', code: 't1' } },
        { correct: true, country: { name: 'T2', code: 't2' } },
        { correct: false, country: { name: 'T3', code: 't3' } },
        { correct: true, country: { name: 'T4', code: 't4' } },
        { correct: true, country: { name: 'T5', code: 't5' } },
      ],
      completed: true,
    };
    localStorageMock.setItem('flagGame', JSON.stringify(savedGame));

    render(<Game />);

    expect(screen.getByText(/come back tomorrow/i)).toBeInTheDocument();
  });
});
