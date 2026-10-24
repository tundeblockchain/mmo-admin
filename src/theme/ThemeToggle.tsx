import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorScheme } from './useColorScheme';

export function ThemeToggle() {
  const { mode, toggleColorScheme } = useColorScheme();
  const isDark = mode === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleColorScheme}
        aria-label={label}
        aria-pressed={isDark}
        color="inherit"
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
