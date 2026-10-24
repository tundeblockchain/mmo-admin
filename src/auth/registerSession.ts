import type { User } from 'firebase/auth';
import { syncCurrentUser } from '../api/users';
import type { CurrentUser } from '../types/account';
import { commitAuthUser, getIdToken } from './authStore';

export async function provisionRegisteredUser(user: User): Promise<CurrentUser> {
  commitAuthUser(user);
  await getIdToken(true);
  return syncCurrentUser();
}
