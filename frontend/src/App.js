import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, Box, Typography, AppBar, Toolbar } from '@mui/material';
import './App.css';
import ApplicationFlow from './components/ApplicationFlow';

// Create a minimal, modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#404040',
    },
    secondary: {
      main: '#202020',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#202020',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#202020',
          '&:hover': {
            backgroundColor: '#404040',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #f0f0f0',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Custom logo component
const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'baseline'
    }}>
      <Typography 
        component="span" 
        sx={{ 
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 600, 
          fontSize: '1.5rem',
          color: '#ffffff',
          letterSpacing: '1.5px',
          mr: 0.5,
          textShadow: '0 0 15px rgba(255,255,255,0.2)'
        }}
      >
        TOMORROW
      </Typography>
      <Typography 
        component="span" 
        sx={{ 
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 300, 
          fontSize: '1.3rem',
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.5px',
          position: 'relative',
          top: '1px'
        }}
      >
        card
      </Typography>
    </Box>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        <AppBar 
          position="static" 
          sx={{ 
            background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)',
            height: {xs: '70px', sm: '80px'},
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Toolbar sx={{ 
            height: '100%', 
            maxWidth: '1200px', 
            width: '100%', 
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            pl: {xs: 2, md: 4}
          }}>
            <Logo />
            <Box 
              sx={{ 
                position: 'absolute', 
                right: '0', 
                top: '0', 
                bottom: '0', 
                width: '25%',
                background: 'linear-gradient(90deg, rgba(26,26,26,0) 0%, rgba(86,86,86,0.1) 100%)',
                display: {xs: 'none', md: 'block'}
              }} 
            />
          </Toolbar>
        </AppBar>
        <ApplicationFlow />
      </Box>
    </ThemeProvider>
  );
}

export default App;
