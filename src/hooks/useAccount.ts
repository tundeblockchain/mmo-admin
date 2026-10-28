import { useQuery } from '@tanstack/react-query';
import { syncCurrentUser } from '../api/users';
import { signOutUser, useAuth } from '../auth';
import { isUnauthorizedError } from '../lib/errors';
import { isAdminAccountType } from '../types/account';
import { queryKeys } from './queryKeys';

export interface AccountState {
  uid: string | null;
  accountType: string | null;
  isAdmin: boolean;
  isPending: boolean;
  isError: boolean;
  isUnauthorized: boolean;
  retry: () => void;
}

async function loadCurrentUser() {
  try {
    return await syncCurrentUser();
  } catch (error) {
    if (isUnauthorizedError(error)) {
      await signOutUser();
    }
    throw error;
  }
}

export function useAccount(): AccountState {
  const authState = useAuth();
  const isVerified =
    authState.status === 'authenticated' && authState.user.emailVerified;
  const uid = isVerified ? authState.user.uid : null;

  const query = useQuery({
    queryKey: queryKeys.account.me(uid ?? 'anonymous'),
    queryFn: loadCurrentUser,
    enabled: uid !== null,
    staleTime: Infinity,
    retry: false,
  });

  return {
    uid,
    accountType: query.data?.accountType ?? null,
    isAdmin: isAdminAccountType(query.data?.accountType),
    isPending: uid !== null && query.isPending,
    isError: uid !== null && query.isError,
    isUnauthorized: uid !== null && isUnauthorizedError(query.error),
    retry: () => {
      void query.refetch();
    },
  };
}
