import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '../theme';

interface WrapperProps {
  children: ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

function createWrapper(initialEntries: string[]) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </MemoryRouter>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: createWrapper(initialEntries),
    ...options,
  });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
