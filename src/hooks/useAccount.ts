import { useQuery } from '@tanstack/react-query';
import { syncCurrentUser } from '../api/users';
import { useAuth } from '../auth';
import { isAdminAccountType } from '../types/account';
import { queryKeys } from './queryKeys';

export interface AccountState {
  uid: string | null;
  accountType: string | null;
  isAdmin: boolean;
  isPending: boolean;
  isError: boolean;
  retry: () => void;
}

export function useAccount(): AccountState {
  const authState = useAuth();
  const isVerified =
    authState.status === 'authenticated' && authState.user.emailVerified;
  const uid = isVerified ? authState.user.uid : null;

  const query = useQuery({
    queryKey: queryKeys.account.me(uid ?? 'anonymous'),
    queryFn: syncCurrentUser,
    enabled: uid !== null,
    staleTime: Infinity,
  });

  return {
    uid,
    accountType: query.data?.accountType ?? null,
    isAdmin: isAdminAccountType(query.data?.accountType),
    isPending: uid !== null && query.isPending,
    isError: query.isError,
    retry: () => {
      void query.refetch();
    },
  };
}
