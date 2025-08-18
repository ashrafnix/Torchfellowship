import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders the button with children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /secondary button/i });
    expect(buttonElement).toHaveClass('bg-brand-surface');
  });

  it('applies the correct size class', () => {
    render(<Button size="lg">Large Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /large button/i });
    expect(buttonElement).toHaveClass('px-8 py-3 text-lg');
  });

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('shows a spinner when isLoading is true', () => {
    const { container } = render(<Button isLoading>Loading</Button>);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const spinnerElement = container.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('renders as a different element when "as" prop is used', () => {
    render(<Button as="a" href="/home">Link Button</Button>);
    const linkElement = screen.getByRole('link', { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/home');
  });
});