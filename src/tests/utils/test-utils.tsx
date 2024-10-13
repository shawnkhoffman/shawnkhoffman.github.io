import { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import MainLayout from '@/layouts/MainLayout';
import type { RenderOptions } from '@/types/test-utils';

interface CustomRenderOptions extends RenderOptions {
  withLayout?: boolean;
}

const customRender = (
  ui: ReactElement,
  { withLayout = false, ...options }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <BrowserRouter>
      <ThemeProvider>
        {withLayout ? <MainLayout>{children}</MainLayout> : children}
      </ThemeProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export { screen, waitFor, fireEvent, act, within } from '@testing-library/react';

export { customRender as render };
