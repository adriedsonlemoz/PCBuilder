import React from 'react';
import { Box, Typography } from '@mui/material';

// ==========================================
const GameHeader = ({ title, fontSize = '1.1rem', bgcolor, color }) => (
  <Box sx={{ 
    bgcolor: bgcolor || 'primary.main', 
    borderBottom: '3px solid', 
    borderColor: 'secondary.main', 
    p: 1, textAlign: 'center', 
    boxShadow: 'inset 0 -3px 5px rgba(0,0,0,0.2)' 
  }}>
    <Typography sx={{ 
      color: color || 'primary.contrastText', fontWeight: '900', fontSize, 
      textShadow: '1px 2px 2px rgba(0,0,0,0.6)', letterSpacing: '0.5px', 
      textTransform: 'uppercase', whiteSpace: 'nowrap', 
      overflow: 'hidden', textOverflow: 'ellipsis' 
    }}>
      {title}
    </Typography>
  </Box>
);

// ==========================================
// ESCUDO ANTI-COLAPSO (ERROR BOUNDARY)

export default GameHeader;
