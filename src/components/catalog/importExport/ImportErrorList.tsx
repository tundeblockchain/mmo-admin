import { List, ListItem, ListItemText, Typography } from '@mui/material';
import type { FieldError } from '../../../lib/catalogImport';

interface ImportErrorListProps {
  errors: FieldError[];
}

export function ImportErrorList({ errors }: ImportErrorListProps) {
  return (
    <List dense aria-label="Import validation errors">
      {errors.map((error) => {
        const path = error.path === '' ? '(file)' : error.path;
        return (
          <ListItem key={`${error.path}:${error.message}`} disableGutters>
            <ListItemText
              primary={
                <Typography variant="body2" color="error">
                  {path}: {error.message}
                </Typography>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}
