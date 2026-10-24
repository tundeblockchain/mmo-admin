export interface CurrentUser {
  uid: string;
  accountType: string;
}

export function isAdminAccountType(
  accountType: string | null | undefined,
): boolean {
  return accountType === 'admin';
}
