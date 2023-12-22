import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for extra matchers like toBeInTheDocument

import AllMails from './AllMails';

describe('AllMails Component', () => {
  // Mock data for testing
  const mockMails = [
    { id: '1', subject: 'Test Subject 1', senderEmail: 'sender@test.com', content: 'Test Content 1', read: false },
    { id: '2', subject: 'Test Subject 2', senderEmail: 'sender@test.com', content: 'Test Content 2', read: true },
  ];

  const mockLocalStorage = {
    getItem: jest.fn(),
  };

  beforeEach(() => {
    // Mock localStorage for the test
    global.localStorage = mockLocalStorage;

    // Clear localStorage mock before each test
    mockLocalStorage.getItem.mockClear();
  });

  test('renders mails and delete button', () => {
    // Mocking localStorage.getItem to return user and token
    mockLocalStorage.getItem.mockReturnValueOnce('user@test.com');
    mockLocalStorage.getItem.mockReturnValueOnce('mock-token');

    render(<AllMails type="inbox" />);
    
    // Check if mails are rendered
    mockMails.forEach((mail) => {
      expect(screen.getByText(mail.subject)).toBeInTheDocument();
      expect(screen.getByText(mail.senderEmail)).toBeInTheDocument();
      expect(screen.getByText(mail.content)).toBeInTheDocument();
    });

    // Check if delete buttons are rendered
    mockMails.forEach((mail) => {
      const deleteButton = screen.getByText('Delete');
      expect(deleteButton).toBeInTheDocument();
    });
  });

  test('deletes a mail when delete button is clicked', async () => {
    // Mocking localStorage.getItem to return user and token
    mockLocalStorage.getItem.mockReturnValueOnce('user@test.com');
    mockLocalStorage.getItem.mockReturnValueOnce('mock-token');

    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    render(<AllMails type="inbox" />);

    // Click the delete button for the first mail
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Wait for the asynchronous delete operation to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Check if the mail is no longer rendered
    expect(screen.queryByText(mockMails[0].subject)).not.toBeInTheDocument();
  });
});
