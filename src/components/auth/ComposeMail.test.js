import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ComposeMailForm from './ComposeMailForm';

describe('ComposeMailForm Component', () => {
  test('Empty Form Submission', async () => {
    const { getByLabelText, getByText } = render(<ComposeMailForm />);

    // Submit the form without entering any values
    fireEvent.click(getByText('Send Mail'));

    // Ensure validation messages are displayed
    expect(getByText('Recipient Email')).toHaveTextContent('required');
    expect(getByText('Subject')).toHaveTextContent('required');
    expect(getByText('Compose Mail')).toHaveTextContent('required');
  });

  test('Valid Form Submission', async () => {
    const { getByLabelText, getByText } = render(<ComposeMailForm />);

    // Enter valid values
    fireEvent.change(getByLabelText('Recipient Email'), { target: { value: 'recipient@example.com' } });
    fireEvent.change(getByLabelText('Subject'), { target: { value: 'Test Subject' } });
    fireEvent.change(getByLabelText('Compose Mail'), { target: { value: 'Test content' } });

    // Submit the form
    fireEvent.click(getByText('Send Mail'));

    // Ensure form is submitted successfully
    await waitFor(() => {
      // Add assertions based on your expected behavior
    });
  });

  test('Invalid Email Format', async () => {
    const { getByLabelText, getByText } = render(<ComposeMailForm />);

    // Enter an invalid email format
    fireEvent.change(getByLabelText('Recipient Email'), { target: { value: 'invalidemail' } });

    // Submit the form
    fireEvent.click(getByText('Send Mail'));

    // Ensure validation message for invalid email format is displayed
    expect(getByText('Recipient Email')).toHaveTextContent('Enter a valid email address');
  });

  test('Form Reset After Submission', async () => {
    const { getByLabelText, getByText } = render(<ComposeMailForm />);

    // Enter valid values
    fireEvent.change(getByLabelText('Recipient Email'), { target: { value: 'recipient@example.com' } });
    fireEvent.change(getByLabelText('Subject'), { target: { value: 'Test Subject' } });
    fireEvent.change(getByLabelText('Compose Mail'), { target: { value: 'Test content' } });

    // Submit the form
    fireEvent.click(getByText('Send Mail'));

    // Ensure form is reset after submission
    await waitFor(() => {
      expect(getByLabelText('Recipient Email')).toHaveValue('');
      expect(getByLabelText('Subject')).toHaveValue('');
      expect(getByLabelText('Compose Mail')).toHaveValue('');
    });
  });

  test('Form Submission API Call', async () => {
    const { getByLabelText, getByText } = render(<ComposeMailForm />);

    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: () => ({}) });

    // Enter valid values
    fireEvent.change(getByLabelText('Recipient Email'), { target: { value: 'recipient@example.com' } });
    fireEvent.change(getByLabelText('Subject'), { target: { value: 'Test Subject' } });
    fireEvent.change(getByLabelText('Compose Mail'), { target: { value: 'Test content' } });

    // Submit the form
    fireEvent.click(getByText('Send Mail'));

    // Ensure the API is called with the correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://mailbox-da34e-default-rtdb.firebaseio.com/mails.json',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"senderEmail":"user"'),
        })
      );
    });
  });

  
});
