import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';


jest.mock('node-fetch');

describe('AuthForm Component', () => {
  test('renders login form by default', () => {
    render(<AuthForm />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('switches to signup form when "Create new account" is clicked', () => {
    render(<AuthForm />);
    fireEvent.click(screen.getByText('Create new account'));
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('submits login form successfully', async () => {
    render(<AuthForm />);
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ idToken: 'mockToken' }),
      ok: true,
    });

    fireEvent.input(screen.getByLabelText('Your Email'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText('Your Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

  });

  test('submits signup form successfully', async () => {
    render(<AuthForm />);
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn(),
      ok: true,
    });

    fireEvent.click(screen.getByText('Create new account'));
    fireEvent.input(screen.getByLabelText('Your Email'), { target: { value: 'newuser@example.com' } });
    fireEvent.input(screen.getByLabelText('Your Password'), { target: { value: 'newpassword123' } });
    fireEvent.input(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });


  });

  test('shows error message on invalid login credentials', async () => {
    render(<AuthForm />);
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ error: { message: 'Invalid credentials' } }),
      ok: false,
    });

    fireEvent.input(screen.getByLabelText('Your Email'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText('Your Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
    });
  });

  test('shows error message on password mismatch during signup', async () => {
    render(<AuthForm />);
    fireEvent.click(screen.getByText('Create new account'));
    fireEvent.input(screen.getByLabelText('Your Email'), { target: { value: 'newuser@example.com' } });
    fireEvent.input(screen.getByLabelText('Your Password'), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText('Confirm Password'), { target: { value: 'differentpassword' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
    });
  });
});
