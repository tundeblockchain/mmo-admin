import { http, HttpResponse } from 'msw';
import type { CurrentUser } from '../../types/account';

export const mockAdminUser: CurrentUser = {
  uid: 'test-uid-123',
  accountType: 'admin',
};

export const userHandlers = [
  http.post('*/users/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Valid Firebase ID token required' },
        { status: 401 },
      );
    }

    return HttpResponse.json(mockAdminUser);
  }),
];
