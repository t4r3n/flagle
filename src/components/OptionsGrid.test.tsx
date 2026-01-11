import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionsGrid } from './OptionsGrid';
import type { Country } from '../types';

describe('OptionsGrid', () => {
  const mockOptions: Country[] = [
    { name: 'United States', code: 'us' },
    { name: 'United Kingdom', code: 'gb' },
    { name: 'France', code: 'fr' },
    { name: 'Germany', code: 'de' },
  ];

  it('renders all 4 options', () => {
    render(<OptionsGrid options={mockOptions} onSelect={() => {}} />);

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  it('calls onSelect with the clicked country', async () => {
    const handleSelect = vi.fn();
    render(<OptionsGrid options={mockOptions} onSelect={handleSelect} />);

    await userEvent.click(screen.getByText('France'));

    expect(handleSelect).toHaveBeenCalledWith(mockOptions[2]);
  });

  it('disables all buttons when disabled', () => {
    render(<OptionsGrid options={mockOptions} onSelect={() => {}} disabled />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
