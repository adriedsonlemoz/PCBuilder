import { createTheme } from '@mui/material/styles';

// ==========================================
// TEMA (Pergaminho)
// ==========================================
export const doaTheme = createTheme({
  palette: {
    background: { default: '#d6c8a3', paper: '#ebdcb8' },
    primary: { main: '#118a8b', contrastText: '#ffffff' },
    secondary: { main: '#a6834d' },
    success: { main: '#32a852', contrastText: '#fff' },
    info: { main: '#1565c0', contrastText: '#fff' },
    error: { main: '#941818', contrastText: '#fff' },
    text: { primary: '#362414', secondary: '#6e5436' },
  },
  typography: {
    fontFamily: '"Nunito", "Quicksand", "Segoe UI", "Roboto", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          textTransform: 'none',
          border: '2px solid #0d3b66',
          boxShadow: '0 4px 6px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
          borderRadius: '6px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '3px solid #a6834d',
          borderRadius: '8px',
          backgroundImage: 'linear-gradient(to bottom, #f5ebd0, #ebdcb8)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
        }
      }
    }
  }
});

// ==========================================
// COMPONENTE GLOBAL GameHeader
