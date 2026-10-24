import { useState } from 'react';
import { AuthHeroLayout } from './AuthHeroLayout';
import { ForgotPasswordPanel } from './ForgotPasswordPanel';
import { RegisterPanel } from './RegisterPanel';
import { SignInPanel } from './SignInPanel';

type AuthView = 'sign-in' | 'register' | 'forgot-password';

export function LoginPage() {
  const [view, setView] = useState<AuthView>('sign-in');

  return (
    <AuthHeroLayout>
      {view === 'sign-in' ? (
        <SignInPanel
          onShowRegister={() => setView('register')}
          onShowForgotPassword={() => setView('forgot-password')}
        />
      ) : null}
      {view === 'register' ? (
        <RegisterPanel onShowSignIn={() => setView('sign-in')} />
      ) : null}
      {view === 'forgot-password' ? (
        <ForgotPasswordPanel onShowSignIn={() => setView('sign-in')} />
      ) : null}
    </AuthHeroLayout>
  );
}
