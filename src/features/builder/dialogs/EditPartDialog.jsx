import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

const EditPartDialog = ({ open, nome, preco, onNomeChange, onPrecoChange, onClose, onSave }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    PaperProps={{ sx: { bgcolor: '#ebdcb8', border: '3px solid #118a8b', borderRadius: '8px' } }}
  >
    <DialogTitle sx={{ color: 'primary.main', fontWeight: '900', textAlign: 'center' }}>✏️ Modificar Atributos</DialogTitle>
    <DialogContent>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'text.secondary', mb: 2 }}>
        Você está editando as informações desta peça. O novo valor será salvo localmente.
      </Typography>
      <TextField
        fullWidth
        size="small"
        label="Nome da Peça"
        value={nome}
        onChange={(e) => onNomeChange(e.target.value)}
        sx={{ mb: 2, mt: 1, bgcolor: '#d6c8a3', '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }}
      />
      <TextField
        fullWidth
        size="small"
        type="number"
        label="Preço (R$)"
        value={preco}
        onChange={(e) => onPrecoChange(e.target.value)}
        sx={{ bgcolor: '#d6c8a3', '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }}
      />
    </DialogContent>
    <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
      <Button onClick={onClose} variant="contained" color="error">Cancelar</Button>
      <Button onClick={onSave} variant="contained" color="success">Salvar Edição</Button>
    </DialogActions>
  </Dialog>
);

export default EditPartDialog;
