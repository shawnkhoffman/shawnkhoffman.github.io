import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainLayout from '../../layouts/MainLayout';
import '@testing-library/jest-dom';

vi.mock('../../components/layout/Navbar', () => ({
  default: () => <nav data-testid="navbar">Mocked Navbar</nav>,
}));

vi.mock('../../components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Mocked Footer</footer>,
}));

vi.mock('../../components/common/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}));

describe('MainLayout Component', () => {
  it('renders Navbar, Footer, and ErrorBoundary with children and matches snapshot', () => {
    const { asFragment } = render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    const navbar = screen.getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveTextContent('Mocked Navbar');

    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('Mocked Footer');

    const errorBoundary = screen.getByTestId('error-boundary');
    expect(errorBoundary).toBeInTheDocument();

    const childContent = screen.getByText('Test Content');
    expect(childContent).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('applies correct layout classes to the main container and matches snapshot', () => {
    const { container, asFragment } = render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'min-h-screen');

    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveClass('flex-grow', 'flex', 'flex-col', 'justify-center', 'items-center', 'bg-base-200', 'text-base-content');

    expect(asFragment()).toMatchSnapshot();
  });
});