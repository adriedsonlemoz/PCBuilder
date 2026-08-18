import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

const SaveSetupDialogs = ({
  saveOpen,
  versionOpen,
  nomeSetup,
  onNomeChange,
  onSaveClose,
  onVersionClose,
  onSave,
  onSaveVersion,
  onOverwrite,
}) => (
  <>
    <Dialog open={saveOpen} onClose={onSaveClose} PaperProps={{ sx: { bgcolor: 'background.paper', border: '3px solid #a6834d', borderRadius: '8px' } }}>
      <DialogTitle sx={{ color: 'primary.main', fontWeight: '900', textAlign: 'center' }}>💾 Batizar a Máquina</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Ex: PC Supremo..."
          value={nomeSetup}
          onChange={(e) => onNomeChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
          sx={{ bgcolor: 'background.default', mt: 1, '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button onClick={onSaveClose} variant="contained" color="error">Cancelar</Button>
        <Button onClick={onSave} variant="contained" color="success">Guardar na Garagem</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={versionOpen} onClose={onVersionClose} PaperProps={{ sx: { bgcolor: 'background.paper', border: '3px solid #a6834d', borderRadius: '12px', minWidth: 320 } }}>
      <DialogTitle sx={{ color: 'primary.main', fontWeight: '900', textAlign: 'center', fontSize: '1.2rem' }}>📂 Setup já existe</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>⚠️</Typography>
        <Typography sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          O setup <span style={{ color: '#118a8b' }}>"{nomeSetup}"</span> já existe.
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', fontWeight: 'bold' }}>
          Como queres guardar esta versão?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, flexDirection: 'column', gap: 1 }}>
        <Button fullWidth variant="contained" color="warning" onClick={onSaveVersion} sx={{ fontWeight: '900' }}>📚 Nova Versão (guarda o histórico)</Button>
        <Button fullWidth variant="contained" color="error" onClick={onOverwrite} sx={{ fontWeight: '900' }}>🗑️ Sobrescrever (apaga o histórico)</Button>
        <Button fullWidth variant="outlined" color="inherit" onClick={onVersionClose} sx={{ fontWeight: '900', borderColor: 'secondary.main', color: 'text.secondary' }}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  </>
);

export default SaveSetupDialogs;
