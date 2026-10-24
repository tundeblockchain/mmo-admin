import { TextField } from '@mui/material';
import { AUTH_TEST_IDS } from './authTestIds';

interface EmailPasswordFieldsProps {
  email: string;
  password: string;
  confirmPassword?: string;
  disabled: boolean;
  showConfirm?: boolean;
  passwordAutoComplete: 'current-password' | 'new-password';
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
}

export function EmailPasswordFields({
  email,
  password,
  confirmPassword = '',
  disabled,
  showConfirm = false,
  passwordAutoComplete,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: EmailPasswordFieldsProps) {
  return (
    <>
      <TextField
        id="auth-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        fullWidth
        value={email}
        disabled={disabled}
        onChange={(event) => onEmailChange(event.target.value)}
        slotProps={{ htmlInput: { 'data-testid': AUTH_TEST_IDS.email } }}
      />
      <TextField
        id="auth-password"
        name="password"
        label="Password"
        type="password"
        autoComplete={passwordAutoComplete}
        required
        fullWidth
        value={password}
        disabled={disabled}
        onChange={(event) => onPasswordChange(event.target.value)}
        slotProps={{ htmlInput: { 'data-testid': AUTH_TEST_IDS.password } }}
      />
      {showConfirm ? (
        <TextField
          id="auth-confirm-password"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          fullWidth
          value={confirmPassword}
          disabled={disabled}
          onChange={(event) => onConfirmPasswordChange?.(event.target.value)}
          slotProps={{
            htmlInput: { 'data-testid': AUTH_TEST_IDS.confirmPassword },
          }}
        />
      ) : null}
    </>
  );
}
