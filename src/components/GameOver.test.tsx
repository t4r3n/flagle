import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameOver } from './GameOver';
import type { RoundResult } from '../types';
import { createMockCountry } from '../test/mockCountry';

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn(),
};
Object.assign(navigator, { clipboard: mockClipboard });

describe('GameOver', () => {
  const mockResults: RoundResult[] = [
    { correct: true, country: createMockCountry({ name: 'US', code: 'us' }) },
    { correct: false, country: createMockCountry({ name: 'UK', code: 'gb' }) },
    { correct: true, country: createMockCountry({ name: 'FR', code: 'fr' }) },
    { correct: true, country: createMockCountry({ name: 'DE', code: 'de' }) },
    { correct: false, country: createMockCountry({ name: 'JP', code: 'jp' }) },
  ];

  beforeEach(() => {
    mockClipboard.writeText.mockClear();
  });

  it('displays the final score', () => {
    render(<GameOver results={mockResults} date="2026-01-09" />);

    expect(screen.getByText('3/5')).toBeInTheDocument();
  });

  it('displays all result ticks', () => {
    render(<GameOver results={mockResults} date="2026-01-09" />);

    const slots = screen.getAllByTestId(/tick-slot/);
    expect(slots).toHaveLength(5);
  });

  it('displays "Come back tomorrow!" message', () => {
    render(<GameOver results={mockResults} date="2026-01-09" />);

    expect(screen.getByText(/come back tomorrow/i)).toBeInTheDocument();
  });

  it('has a Share button', () => {
    render(<GameOver results={mockResults} date="2026-01-09" />);

    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('copies share text to clipboard when Share is clicked', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    render(<GameOver results={mockResults} date="2026-01-09" />);

    await userEvent.click(screen.getByRole('button', { name: /share/i }));

    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('🏴 Flagle 2026-01-09')
    );
    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('✅❌✅✅❌')
    );
    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('3/5')
    );
  });

  it('shows "Copied!" after clicking Share', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    render(<GameOver results={mockResults} date="2026-01-09" />);

    await userEvent.click(screen.getByRole('button', { name: /share/i }));

    expect(screen.getByText(/copied/i)).toBeInTheDocument();
  });
});
