export {};

declare global {
  interface Window {
    __E2E_AUTH__?: {
      enabled: boolean;
      user?: {
        uid: string;
        email: string;
        displayName: string;
        idToken: string;
        emailVerified?: boolean;
      } | null;
    };
    __E2E_SIGN_IN_WITH_EMAIL_PASSWORD__?: (
      email: string,
      password: string,
    ) => Promise<void>;
  }
}
