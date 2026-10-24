export const MIN_PASSWORD_LENGTH = 6;

export const AUTH_MESSAGES = {
  invalidCredentials: 'Email or password is incorrect.',
  genericSignIn: 'Unable to sign in. Try again.',
  genericRegister:
    'Unable to create an account. Try again, or sign in if you already have one.',
  resetSent: 'If an account exists for that email, a reset link has been sent.',
  genericVerify: 'Unable to send a verification email. Try again.',
  stillUnverified:
    'This email is not verified yet. Open the link in your inbox, then try again.',
  verifyTitle: 'Verify your email',
  verifyBody:
    'We sent a verification link to your email. Open it, then continue.',
  verifyResent: 'Verification email sent.',
  weakPassword: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  passwordMismatch: 'Passwords do not match.',
  invalidEmail: 'Enter a valid email address.',
  tooManyRequests: 'Too many attempts. Try again later.',
  network: 'Unable to reach the sign-in service. Try again.',
  googleCancelled: 'Sign-in was cancelled.',
  googleFailed: 'Failed to sign in with Google.',
  continueFailed: 'Unable to confirm verification. Try again.',
} as const;

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
