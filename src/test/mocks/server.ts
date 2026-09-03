import { setupServer } from 'msw/node';
import { catalogHandlers } from './catalog-handlers';

export const server = setupServer(...catalogHandlers);
