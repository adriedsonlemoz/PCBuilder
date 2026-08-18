import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';

const CustomPartDialog = ({
  open,
  categoriaKey,
  categoriaNome,
  sockets,
  nome,
  preco,
  socket,
  brand,
  ramType,
  ramCap,
  onNomeChange,
  onPrecoChange,
  onSocketChange,
  onBrandChange,
  onRamTypeChange,
  onRamCapChange,
  onClose,
  onSave,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    PaperProps={{ sx: { bgcolor: '#ebdcb8', border: '3px solid #118a8b', borderRadius: '8px' } }}
  >
    <DialogTitle sx={{ color: 'primary.main', fontWeight: '900', textAlign: 'center' }}>
      ➕ Inserir {categoriaNome.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')}
    </DialogTitle>
    <DialogContent>
      <TextField fullWidth size="small" label="Nome da Peça" value={nome} onChange={(e) => onNomeChange(e.target.value)} sx={{ mb: 2, mt: 1, bgcolor: '#d6c8a3', '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }} />

      {(categoriaKey === 'mb' || categoriaKey === 'cpu') && (
        <TextField select fullWidth size="small" label="Soquete" value={socket} onChange={(e) => onSocketChange(e.target.value)} sx={{ mb: 2, bgcolor: '#d6c8a3', '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }}>
          {sockets.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
        </TextField>
      )}

      {categoriaKey === 'cpu' && (
        <TextField select fullWidth size="small" label="Marca" value={brand} onChange={(e) => onBrandChange(e.target.value)} sx={{ mb: 2, bgcolor: '#d6c8a3', '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }}>
          <MenuItem value="Intel">Intel</MenuItem>
          <MenuItem value="AMD">AMD</MenuItem>
        </TextField>
      )}

      {(categoriaKey === 'mb' || categoriaKey === 'ram') && (
        <TextField select fullWidth size="small" label="Memória" value={ramType} onChange={(e) => onRamTypeChange(e.target.value)} sx={{ mb: 2, bgcolor: '#d6c8a3', '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }}>
          <MenuItem value="DDR3">DDR3</MenuItem>
          <MenuItem value="DDR4">DDR4</MenuItem>
          <MenuItem value="DDR5">DDR5</MenuItem>
        </TextField>
      )}

      {categoriaKey === 'ram' && (
        <TextField select fullWidth size="small" label="Capacidade (GB)" value={ramCap} onChange={(e) => onRamCapChange(e.target.value)} sx={{ mb: 2, bgcolor: '#d6c8a3', '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }}>
          <MenuItem value="4">4 GB</MenuItem>
          <MenuItem value="8">8 GB</MenuItem>
          <MenuItem value="16">16 GB</MenuItem>
          <MenuItem value="32">32 GB</MenuItem>
          <MenuItem value="64">64 GB</MenuItem>
        </TextField>
      )}

      <TextField fullWidth size="small" type="number" label="Preço (R$)" value={preco} onChange={(e) => onPrecoChange(e.target.value)} sx={{ bgcolor: '#d6c8a3', '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }} />
    </DialogContent>
    <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
      <Button onClick={onClose} variant="contained" color="error">Cancelar</Button>
      <Button onClick={onSave} variant="contained" color="success">Adicionar</Button>
    </DialogActions>
  </Dialog>
);

export default CustomPartDialog;
