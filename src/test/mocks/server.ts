import { setupServer } from 'msw/node';
import { catalogHandlers } from './catalog-handlers';
import { userHandlers } from './user-handlers';

export const server = setupServer(...catalogHandlers, ...userHandlers);
