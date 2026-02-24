import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Dashboard,
  List,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppBarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const AppBar: React.FC<AppBarProps> = ({ toggleTheme, isDarkMode }) => {
  // const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <MuiAppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, mr: 4, fontWeight: 600 }}
        >
          VaultBridge Monitor
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            startIcon={<List />}
            onClick={() => navigate('/events')}
            sx={{
              backgroundColor: isActive('/events') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Events
          </Button>
        </Box>

        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ ml: 1 }}
        >
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
}; 