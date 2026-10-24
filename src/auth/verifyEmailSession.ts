import { syncCurrentUser } from '../api/users';
import { AUTH_MESSAGES } from './authMessages';
import { commitAuthUser, getIdToken, peekReloadedUser } from './authStore';

export async function confirmEmailVerified(): Promise<void> {
  const user = await peekReloadedUser();
  if (!user?.emailVerified) {
    throw new Error(AUTH_MESSAGES.stillUnverified);
  }

  await getIdToken(true);
  await syncCurrentUser();
  commitAuthUser(user);
}
