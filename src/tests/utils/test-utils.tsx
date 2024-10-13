import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import MainLayout from '@/layouts/MainLayout';

interface CustomRenderOptions extends RenderOptions {
  withLayout?: boolean;
}

const customRender = (
  ui: ReactElement,
  { withLayout = false, ...options }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <ThemeProvider>
        {withLayout ? <MainLayout>{children}</MainLayout> : children}
      </ThemeProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

export { customRender as render };
