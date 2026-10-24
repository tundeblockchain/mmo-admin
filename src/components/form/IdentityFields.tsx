import { type ReactNode } from 'react';
import { Box, TextField } from '@mui/material';

interface IdentityFieldsProps {
  idLabel: string;
  idValue: string;
  onIdChange: (value: string) => void;
  idError?: string | null;
  idHelperText: string;
  nameValue: string;
  onNameChange: (value: string) => void;
  descriptionValue?: string;
  onDescriptionChange?: (value: string) => void;
  descriptionGutter?: boolean;
  children?: ReactNode;
}

export function IdentityFields({
  idLabel,
  idValue,
  onIdChange,
  idError = null,
  idHelperText,
  nameValue,
  onNameChange,
  descriptionValue,
  onDescriptionChange,
  descriptionGutter = true,
  children,
}: IdentityFieldsProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        label={idLabel}
        value={idValue}
        onChange={(event) => onIdChange(event.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        error={idError !== null}
        helperText={idError ?? idHelperText}
      />
      <TextField
        label="Display Name"
        value={nameValue}
        onChange={(event) => onNameChange(event.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
      {onDescriptionChange !== undefined && descriptionValue !== undefined && (
        <TextField
          label="Description"
          value={descriptionValue}
          onChange={(event) => onDescriptionChange(event.target.value)}
          fullWidth
          multiline
          rows={2}
          size="small"
          sx={descriptionGutter ? { mb: 2 } : undefined}
        />
      )}
      {children}
    </Box>
  );
}
