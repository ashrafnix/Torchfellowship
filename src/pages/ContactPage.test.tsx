import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/query-core';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter } = ReactRouterDOM as any;
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactPage from './ContactPage';
import { useApi } from '../hooks/useApi';

// Mock the useApi hook
vi.mock('../hooks/useApi');

const mockApiClient = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries for tests
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <HashRouter>{ui}</HashRouter>
    </QueryClientProvider>
  );
};

describe('ContactPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-assign the mock implementation for useApi for each test
    vi.mocked(useApi).mockReturnValue({ apiClient: mockApiClient });
  });

  it('renders the contact form correctly', () => {
    renderWithProviders(<ContactPage />);
    
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('allows a user to fill out and submit the form', async () => {
    mockApiClient.mockResolvedValue({ message: 'Success' });
    const user = userEvent.setup();
    renderWithProviders(<ContactPage />);

    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/your email/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageTextarea = screen.getByPlaceholderText(/your message/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });

    // Simulate user input
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(subjectInput, 'Question about events');
    await user.type(messageTextarea, 'This is a test message.');

    // Assert input values
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(subjectInput).toHaveValue('Question about events');
    expect(messageTextarea).toHaveValue('This is a test message.');

    // Simulate form submission
    await user.click(submitButton);

    // Assert that the API client was called correctly
    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith(
        '/api/contact-messages', 
        'POST', 
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          subject: 'Question about events',
          message: 'This is a test message.',
        }
      );
    });

    // Assert the button shows loading state during submission
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    
    // After submission, the form should be reset
    await waitFor(() => {
        expect(nameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
    });
  });

  it('shows an error state if the submission fails', async () => {
    const user = userEvent.setup();
    // We don't need to mock toastify, just ensure our mutation's onError is called
    // and the button is re-enabled.
    mockApiClient.mockRejectedValue(new Error('Network Error'));
    renderWithProviders(<ContactPage />);
    
    // Fill the form
    await user.type(screen.getByLabelText(/your name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/your email/i), 'jane@test.com');
    await user.type(screen.getByLabelText(/subject/i), 'Inquiry');
    await user.type(screen.getByPlaceholderText(/your message/i), 'A test inquiry.');

    // Submit
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Wait for the mutation to finish
    await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
    });
  });
});