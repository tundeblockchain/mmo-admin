import { http, HttpResponse } from 'msw';
import { server } from './mocks/server';

export function mockEmptyCatalogApi() {
  server.use(
    http.get('*/catalog/versions', () => HttpResponse.json([])),
    http.get('*/catalog/versions/latest', () => HttpResponse.json({ versions: {} })),
    http.get('*/catalog/:catalogType/v/:version', () => {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }),
  );
}
