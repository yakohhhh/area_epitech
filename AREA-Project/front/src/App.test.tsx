import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders main AREA heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', {
      name: /^AREA$/,
    });
    expect(heading).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    render(<App />);
  });
});
