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
      } | null;
    };
  }
}
