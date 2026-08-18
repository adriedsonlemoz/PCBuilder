import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const TacticalErrorDialog = ({ error, onClose }) => (
  <Dialog
    open={error.open}
    onClose={onClose}
    PaperProps={{ sx: { bgcolor: '#ebdcb8', border: '4px solid #941818', borderRadius: '12px', p: 1 } }}
  >
    <DialogTitle sx={{ color: 'error.main', fontWeight: '900', textAlign: 'center', fontSize: '1.4rem', pb: 1 }}>
      {error.titulo}
    </DialogTitle>
    <DialogContent sx={{ textAlign: 'center' }}>
      <Typography sx={{ fontSize: '3rem', mb: 1, lineHeight: 1 }}>🚧</Typography>
      <Typography sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '1.05rem', lineHeight: 1.4 }}>
        {error.msg}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
      <Button onClick={onClose} variant="contained" color="error" sx={{ fontWeight: '900', px: 4 }}>Entendido, Chefe!</Button>
    </DialogActions>
  </Dialog>
);

export default TacticalErrorDialog;
