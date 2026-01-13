import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionButton } from './OptionButton';
import { createMockCountry } from '../test/mockCountry';

describe('OptionButton', () => {
  const mockCountry = createMockCountry({ name: 'United States', code: 'us' });

  it('renders country name', () => {
    render(<OptionButton country={mockCountry} onClick={() => {}} />);

    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<OptionButton country={mockCountry} onClick={handleClick} />);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledWith(mockCountry);
  });

  it('is disabled when disabled prop is true', () => {
    render(<OptionButton country={mockCountry} onClick={() => {}} disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
