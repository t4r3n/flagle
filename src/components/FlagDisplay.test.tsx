import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlagDisplay } from './FlagDisplay';

describe('FlagDisplay', () => {
  it('renders flag image with correct src', () => {
    render(<FlagDisplay code="us" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/flags/us.svg');
  });

  it('has accessible alt text', () => {
    render(<FlagDisplay code="gb" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Flag to guess');
  });
});
