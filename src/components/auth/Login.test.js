import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

// Mocking the global fetch function
jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());

test('renders Login component', () => {
  render(<Login />);
});

test('submits form with valid data', async () => {
  const { getByLabelText, getByText } = render(<Login />);
  
  // Simulate user input
  fireEvent.change(getByLabelText(/your email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(getByLabelText(/your password/i), { target: { value: 'password123' } });
  
  // Simulate form submission
  fireEvent.click(getByText(/login/i));
  
  // Wait for asynchronous tasks to complete (e.g., API call)
  await waitFor(() => {
    // Assert that the user is redirected to the welcome page
    expect(window.location.pathname).toBe('/welcome');
  });
});

test('handles form submission with invalid data', async () => {
  const { getByLabelText, getByText } = render(<Login />);
  
  // Simulate user input with invalid email and password
  fireEvent.change(getByLabelText(/your email/i), { target: { value: 'invalid-email' } });
  fireEvent.change(getByLabelText(/your password/i), { target: { value: 'short' } });
  
  // Simulate form submission
  fireEvent.click(getByText(/login/i));
  
  // Wait for asynchronous tasks to complete (e.g., API call)
  await waitFor(() => {
    // Assert that an error message is displayed
    expect(getByText(/authentication failed/i)).toBeInTheDocument();
  });
});

test('navigates to signup page', async () => {
  const { getByText } = render(<Login />);
  
  // Simulate user clicking the "Create new account" button
  fireEvent.click(getByText(/create new account/i));
  
  // Wait for asynchronous tasks to complete (e.g., navigation)
  await waitFor(() => {
    // Assert that the user is redirected to the signup page
    expect(window.location.pathname).toBe('/signup');
  });
});

test('handles login failure', async () => {
  const { getByLabelText, getByText } = render(<Login />);
  
  // Simulate user input
  fireEvent.change(getByLabelText(/your email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(getByLabelText(/your password/i), { target: { value: 'password123' } });
  
  // Mock the fetch function to simulate a failed API call
  fetch.mockRejectOnce(() => Promise.reject('API error'));
  
  // Simulate form submission
  fireEvent.click(getByText(/login/i));
  
  // Wait for asynchronous tasks to complete (e.g., API call)
  await waitFor(() => {
    // Assert that an error message is displayed
    expect(getByText(/an error occurred/i)).toBeInTheDocument();
  });
});
