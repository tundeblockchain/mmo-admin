import { type ReactNode } from 'react';
import { useAccount } from '../../hooks/useAccount';
import { AccountRetryPage } from '../../pages/Account/AccountRetryPage';
import { NotAnAdminPage } from '../../pages/Account/NotAnAdminPage';
import { FullPageSpinner } from '../common/FullPageSpinner';

interface AdminGateProps {
  children: ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const account = useAccount();

  if (account.uid === null || account.isPending || account.isUnauthorized) {
    return <FullPageSpinner label="Loading account" />;
  }

  if (account.isError) {
    return <AccountRetryPage onRetry={account.retry} />;
  }

  if (!account.isAdmin) {
    return <NotAnAdminPage />;
  }

  return <>{children}</>;
}
