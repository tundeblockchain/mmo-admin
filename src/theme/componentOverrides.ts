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
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
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
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
      },
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
