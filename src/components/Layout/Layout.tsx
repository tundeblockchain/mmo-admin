import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth, signOutUser } from '../../auth';
import { useAccount } from '../../hooks/useAccount';
import { ThemeToggle } from '../../theme';
import { SidebarNav } from './SidebarNav';

const DRAWER_WIDTH = 240;

export function Layout() {
  const authState = useAuth();
  useAccount();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = anchorEl !== null;

  const user =
    authState.status === 'authenticated' ? authState.user : null;

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleSignOut() {
    handleMenuClose();
    signOutUser().catch(() => {
      // Sign out errors are non-critical
    });
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="h1" noWrap sx={{ flexGrow: 1 }}>
            MMO Admin
          </Typography>

          <ThemeToggle />

          {user && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                aria-label="Account menu"
                aria-controls={menuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
              >
                <Avatar
                  src={user.photoURL ?? undefined}
                  alt={user.displayName ?? 'User'}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {user.displayName ?? user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                  <Button variant="text" size="small">
                    Sign out
                  </Button>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        slotProps={{
          paper: {
            'aria-label': 'Sidebar',
          },
        }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <SidebarNav />
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
