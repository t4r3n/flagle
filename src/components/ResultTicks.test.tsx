import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultTicks } from './ResultTicks';
import type { RoundResult } from '../types';

describe('ResultTicks', () => {
  it('renders 5 tick slots', () => {
    render(<ResultTicks results={[]} />);

    const slots = screen.getAllByTestId(/tick-slot/);
    expect(slots).toHaveLength(5);
  });

  it('shows checkmark icon for correct answers', () => {
    const results: RoundResult[] = [
      { correct: true, country: { name: 'US', code: 'us' } },
    ];

    render(<ResultTicks results={results} />);

    const slot = screen.getByTestId('tick-slot-0');
    // Check that slot has emerald (green) styling for correct
    expect(slot.className).toContain('bg-emerald-100');
    expect(slot.className).toContain('border-emerald-400');
    // Check that SVG icon is present
    expect(slot.querySelector('svg')).toBeInTheDocument();
  });

  it('shows X icon for incorrect answers', () => {
    const results: RoundResult[] = [
      { correct: false, country: { name: 'US', code: 'us' } },
    ];

    render(<ResultTicks results={results} />);

    const slot = screen.getByTestId('tick-slot-0');
    // Check that slot has rose (red) styling for incorrect
    expect(slot.className).toContain('bg-rose-100');
    expect(slot.className).toContain('border-rose-400');
    // Check that SVG icon is present
    expect(slot.querySelector('svg')).toBeInTheDocument();
  });

  it('shows empty slots for unanswered rounds', () => {
    const results: RoundResult[] = [
      { correct: true, country: { name: 'US', code: 'us' } },
      { correct: false, country: { name: 'UK', code: 'gb' } },
    ];

    render(<ResultTicks results={results} />);

    // First slot - correct (emerald)
    expect(screen.getByTestId('tick-slot-0').className).toContain('bg-emerald-100');
    // Second slot - incorrect (rose)
    expect(screen.getByTestId('tick-slot-1').className).toContain('bg-rose-100');
    // Empty slots (slate)
    expect(screen.getByTestId('tick-slot-2').className).toContain('bg-slate-100');
    expect(screen.getByTestId('tick-slot-3').className).toContain('bg-slate-100');
    expect(screen.getByTestId('tick-slot-4').className).toContain('bg-slate-100');
    // Empty slots should not have SVG icons
    expect(screen.getByTestId('tick-slot-2').querySelector('svg')).toBeNull();
    expect(screen.getByTestId('tick-slot-3').querySelector('svg')).toBeNull();
    expect(screen.getByTestId('tick-slot-4').querySelector('svg')).toBeNull();
  });

  it('renders all 5 results correctly', () => {
    const results: RoundResult[] = [
      { correct: true, country: { name: 'US', code: 'us' } },
      { correct: false, country: { name: 'UK', code: 'gb' } },
      { correct: true, country: { name: 'FR', code: 'fr' } },
      { correct: true, country: { name: 'DE', code: 'de' } },
      { correct: false, country: { name: 'JP', code: 'jp' } },
    ];

    render(<ResultTicks results={results} />);

    // Check correct answers have emerald styling
    expect(screen.getByTestId('tick-slot-0').className).toContain('bg-emerald-100');
    expect(screen.getByTestId('tick-slot-2').className).toContain('bg-emerald-100');
    expect(screen.getByTestId('tick-slot-3').className).toContain('bg-emerald-100');

    // Check incorrect answers have rose styling
    expect(screen.getByTestId('tick-slot-1').className).toContain('bg-rose-100');
    expect(screen.getByTestId('tick-slot-4').className).toContain('bg-rose-100');

    // All slots should have SVG icons
    for (let i = 0; i < 5; i++) {
      expect(screen.getByTestId(`tick-slot-${i}`).querySelector('svg')).toBeInTheDocument();
    }
  });
});
