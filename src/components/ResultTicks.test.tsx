import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultTicks } from './ResultTicks';
import type { RoundResult } from '../types';
import { createMockCountry } from '../test/mockCountry';

describe('ResultTicks', () => {
  it('renders 5 tick slots', () => {
    render(<ResultTicks results={[]} />);

    const slots = screen.getAllByTestId(/tick-slot/);
    expect(slots).toHaveLength(5);
  });

  it('shows checkmark icon for correct answers', () => {
    const results: RoundResult[] = [
      { correct: true, country: createMockCountry({ name: 'US', code: 'us' }) },
    ];

    render(<ResultTicks results={results} />);

    const slot = screen.getByTestId('tick-slot-0');
    // Check that slot has green styling for correct
    expect(slot.className).toContain('bg-[#538d4e]');
    // Check that SVG icon is present
    expect(slot.querySelector('svg')).toBeInTheDocument();
  });

  it('shows X icon for incorrect answers', () => {
    const results: RoundResult[] = [
      { correct: false, country: createMockCountry({ name: 'US', code: 'us' }) },
    ];

    render(<ResultTicks results={results} />);

    const slot = screen.getByTestId('tick-slot-0');
    // Check that slot has red styling for incorrect
    expect(slot.className).toContain('bg-[#b91c1c]');
    // Check that SVG icon is present
    expect(slot.querySelector('svg')).toBeInTheDocument();
  });

  it('shows empty slots for unanswered rounds', () => {
    const results: RoundResult[] = [
      { correct: true, country: createMockCountry({ name: 'US', code: 'us' }) },
      { correct: false, country: createMockCountry({ name: 'UK', code: 'gb' }) },
    ];

    render(<ResultTicks results={results} />);

    // First slot - correct (green)
    expect(screen.getByTestId('tick-slot-0').className).toContain('bg-[#538d4e]');
    // Second slot - incorrect (red)
    expect(screen.getByTestId('tick-slot-1').className).toContain('bg-[#b91c1c]');
    // Empty slots (dark gray)
    expect(screen.getByTestId('tick-slot-2').className).toContain('bg-[#3a3a3c]');
    expect(screen.getByTestId('tick-slot-3').className).toContain('bg-[#3a3a3c]');
    expect(screen.getByTestId('tick-slot-4').className).toContain('bg-[#3a3a3c]');
    // Empty slots should not have SVG icons
    expect(screen.getByTestId('tick-slot-2').querySelector('svg')).toBeNull();
    expect(screen.getByTestId('tick-slot-3').querySelector('svg')).toBeNull();
    expect(screen.getByTestId('tick-slot-4').querySelector('svg')).toBeNull();
  });

  it('renders all 5 results correctly', () => {
    const results: RoundResult[] = [
      { correct: true, country: createMockCountry({ name: 'US', code: 'us' }) },
      { correct: false, country: createMockCountry({ name: 'UK', code: 'gb' }) },
      { correct: true, country: createMockCountry({ name: 'FR', code: 'fr' }) },
      { correct: true, country: createMockCountry({ name: 'DE', code: 'de' }) },
      { correct: false, country: createMockCountry({ name: 'JP', code: 'jp' }) },
    ];

    render(<ResultTicks results={results} />);

    // Check correct answers have green styling
    expect(screen.getByTestId('tick-slot-0').className).toContain('bg-[#538d4e]');
    expect(screen.getByTestId('tick-slot-2').className).toContain('bg-[#538d4e]');
    expect(screen.getByTestId('tick-slot-3').className).toContain('bg-[#538d4e]');

    // Check incorrect answers have red styling
    expect(screen.getByTestId('tick-slot-1').className).toContain('bg-[#b91c1c]');
    expect(screen.getByTestId('tick-slot-4').className).toContain('bg-[#b91c1c]');

    // All slots should have SVG icons
    for (let i = 0; i < 5; i++) {
      expect(screen.getByTestId(`tick-slot-${i}`).querySelector('svg')).toBeInTheDocument();
    }
  });
});
