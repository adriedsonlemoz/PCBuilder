import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const DeletePartDialog = ({ open, peca, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { bgcolor: '#ebdcb8', border: '4px solid #941818', borderRadius: '12px', minWidth: '300px' } }}
  >
    <DialogTitle sx={{ color: 'error.main', fontWeight: '900', textAlign: 'center', fontSize: '1.4rem' }}>
      ⚠️ Confirmar Exclusão
    </DialogTitle>
    <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
      <Typography sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '1rem' }}>
        Tem certeza que deseja apagar permanentemente a peça:
      </Typography>
      <Typography sx={{ fontWeight: '900', color: 'error.main', fontSize: '1.2rem', mt: 1 }}>
        "{peca?.name}"?
      </Typography>
      <Typography sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.85rem', mt: 2 }}>
        Esta ação não pode ser desfeita.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
      <Button onClick={onClose} variant="contained" color="info" sx={{ fontWeight: '900' }}>Cancelar</Button>
      <Button onClick={onConfirm} variant="contained" color="error" sx={{ fontWeight: '900' }}>Sim, Excluir</Button>
    </DialogActions>
  </Dialog>
);

export default DeletePartDialog;
