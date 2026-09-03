import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth, signOutUser } from '../../auth';

const DRAWER_WIDTH = 240;

const navItems = [
  { to: '/', label: 'Home', icon: <HomeIcon /> },
  { to: '/catalog', label: 'Catalog', icon: <InventoryIcon /> },
];

export function Layout() {
  const authState = useAuth();
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

          {user && (
            <>
              <IconButton
                onClick={handleMenuOpen}
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
          <List component="nav" aria-label="Main navigation">
            {navItems.map(({ to, label, icon }) => (
              <ListItem key={to} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={to}
                  sx={{
                    '&.active': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
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
