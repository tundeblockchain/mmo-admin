import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { NavLink } from 'react-router-dom';
import { CATALOG_SECTIONS, catalogPath } from '../../lib/catalogRoutes';

const activeNavSx = {
  '&.active': {
    backgroundColor: 'action.selected',
  },
} as const;

export function SidebarNav() {
  return (
    <List component="nav" aria-label="Main navigation">
      <ListItem disablePadding>
        <ListItemButton component={NavLink} to="/" end sx={activeNavSx}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </ListItem>
      <List
        component="nav"
        aria-label="Catalog"
        disablePadding
        subheader={
          <ListSubheader
            component="div"
            disableSticky
            sx={{ bgcolor: 'transparent', color: 'text.secondary' }}
          >
            Catalog
          </ListSubheader>
        }
      >
        {CATALOG_SECTIONS.map((section) => (
          <ListItem key={section.slug} disablePadding>
            <ListItemButton
              component={NavLink}
              to={catalogPath(section.slug)}
              sx={{ ...activeNavSx, pl: 4 }}
            >
              <ListItemText primary={section.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </List>
  );
}
