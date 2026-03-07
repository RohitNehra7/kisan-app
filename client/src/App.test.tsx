import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders kisan app', () => {
  render(<App />);
  const headerElement = screen.getByText(/Real-time Market Intelligence/i);
  expect(headerElement).toBeInTheDocument();
});
