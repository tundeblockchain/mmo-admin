import type { ThemeOptions } from '@mui/material/styles';

export const componentOverrides: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        margin: 0,
      },
    },
  },
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
      color: 'primary',
    },
    styleOverrides: {
      colorPrimary: ({ theme }) => ({
        backgroundColor: theme.palette.navy.main,
        backgroundImage: 'none',
        color: theme.palette.navy.contrastText,
        borderBottom: `1px solid ${theme.palette.navy.light}`,
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.sidebar.background,
        color: theme.palette.text.primary,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
        borderRadius: theme.radii.none,
        '& .MuiListItemIcon-root': {
          color: theme.palette.text.secondary,
        },
      }),
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.radii.card,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radii.card,
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: theme.radii.card,
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: theme.radii.control,
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radii.control,
      }),
    },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radii.control,
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        marginInline: theme.spacing(1),
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
        },
      }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.action.hover,
        '& .MuiTableCell-head': {
          color: theme.palette.text.secondary,
          fontWeight: 600,
        },
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&:nth-of-type(even):not(.MuiTableRow-head)': {
          backgroundColor: theme.palette.action.hover,
        },
      }),
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: 12,
      },
    },
  },
};
