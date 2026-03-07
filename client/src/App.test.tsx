import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/KisanNiti/i);
  expect(headerElement).toBeInTheDocument();
});
