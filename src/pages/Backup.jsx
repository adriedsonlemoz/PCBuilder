import React, { useState } from 'react';
import { Alert, Box, Button, Card, Divider, Snackbar, TextField, Typography } from '@mui/material';
import GameHeader from '../components/GameHeader';
import { createBackupPayload, decodeBackup, encodeBackup, restoreBackup } from '../services/backupService';

const Backup = ({ setRoute }) => {
  const [backupCode, setBackupCode] = useState('');
  const [restoreCode, setRestoreCode] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });
  const closeToast = () => setToast(prev => ({ ...prev, open: false }));

  const handleGenerateBackup = () => {
    try {
      const payload = createBackupPayload();
      const vazio = Object.keys(payload.setups).length === 0 && payload.customParts.length === 0 && Object.keys(payload.editedParts).length === 0;
      if (vazio) return showToast('O Meu PC está vazio! Não há dados para fazer backup.', 'warning');
      setBackupCode(encodeBackup(payload));
      showToast('Código de backup v2 gerado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro ao gerar o código. Os dados podem estar corrompidos.', 'error');
    }
  };

  const handleCopyBackup = () => {
    if (!backupCode) return showToast('Gere o backup primeiro!', 'warning');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(backupCode)
        .then(() => showToast('Código copiado! Guarde-o num local seguro.', 'info'))
        .catch(() => showToast('O aparelho bloqueou a cópia. Copie o texto manualmente.', 'warning'));
    } else showToast('Selecione o texto abaixo e copie manualmente.', 'warning');
  };

  const handleRestoreBackup = () => {
    if (!restoreCode.trim()) return showToast('Cole o código primeiro!', 'warning');
    try {
      const data = decodeBackup(restoreCode);
      restoreBackup(data);
      setRestoreCode('');
      showToast(`Backup v${data.backupVersion} restaurado com sucesso. Recarregando...`, 'success');
      setTimeout(() => window.location.reload(), 1200);
    } catch (error) {
      console.error(error);
      showToast('Erro! O código está incompleto, inválido ou corrompido.', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', py: 4, px: 2 }}>
      <Box sx={{ mb: 3 }}><Button variant="contained" color="error" onClick={() => setRoute('home')} sx={{ fontWeight: 'bold' }}>◀ Voltar</Button></Box>
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>{toast.message}</Alert>
      </Snackbar>
      <Card sx={{ p: 0, overflow: 'hidden', border: '3px solid #b45309' }}>
        <GameHeader title="💾 Proteção de Dados (Backup)" />
        <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#e2d5b5' }}>
          <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1.2rem', mb: 0.5, textTransform: 'uppercase' }}>1. Criar Cópia (Exportar)</Typography>
          <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.9rem', mb: 3, lineHeight: 1.4 }}>
            O backup v2 inclui computadores montados, peças manuais e edições feitas nas peças oficiais. O código é codificado em Base64 para transporte; não é criptografia.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="contained" color="success" size="large" onClick={handleGenerateBackup} sx={{ flex: 1, fontWeight: 900 }}>Gerar Código</Button>
            <Button variant="contained" color="info" size="large" onClick={handleCopyBackup} disabled={!backupCode} sx={{ fontWeight: 900 }}>Copiar</Button>
          </Box>
          {backupCode && <TextField fullWidth multiline rows={4} value={backupCode} InputProps={{ readOnly: true }} sx={{ bgcolor: '#ebdcb8', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main', fontSize: '0.75rem', fontFamily: 'monospace' } }} />}
          <Divider sx={{ my: 4, borderColor: '#a6834d', opacity: 0.4 }} />
          <Typography sx={{ color: 'error.main', fontWeight: 900, fontSize: '1.2rem', mb: 0.5, textTransform: 'uppercase' }}>2. Restaurar Cópia (Importar)</Typography>
          <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.9rem', mb: 3, lineHeight: 1.4 }}>
            Aceita backups v2 e também o formato antigo v1. A restauração substitui os dados locais atuais.
          </Typography>
          <TextField fullWidth multiline rows={4} placeholder="Cole o código de backup aqui..." value={restoreCode} onChange={(e) => setRestoreCode(e.target.value)} sx={{ mb: 2, bgcolor: '#ebdcb8', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', fontSize: '0.75rem', fontFamily: 'monospace' } }} />
          <Button fullWidth variant="contained" color="error" size="large" onClick={handleRestoreBackup} sx={{ fontWeight: 900 }}>Restaurar Backup Agora</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Backup;
