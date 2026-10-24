import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ThemeModeProvider } from '../theme';

interface WrapperProps {
  children: ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  withMemoryRouter?: boolean;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function createWrapper(initialEntries: string[], withMemoryRouter: boolean) {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: WrapperProps) {
    const themed = <ThemeModeProvider>{children}</ThemeModeProvider>;
    return (
      <QueryClientProvider client={queryClient}>
        {withMemoryRouter ? (
          <MemoryRouter initialEntries={initialEntries}>{themed}</MemoryRouter>
        ) : (
          themed
        )}
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    withMemoryRouter = true,
    ...options
  }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: createWrapper(initialEntries, withMemoryRouter),
    ...options,
  });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
export { default as userEvent } from '@testing-library/user-event';
