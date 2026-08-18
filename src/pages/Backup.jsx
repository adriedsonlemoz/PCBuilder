import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, AppBar, Box, Button, Card, Chip, Collapse, Container, CssBaseline,
  Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, Grid,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Slider,
  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField,
  ThemeProvider, Toolbar, Tooltip, Typography, createTheme
} from '@mui/material';
import GameHeader from '../components/GameHeader';
import { dbPcParts } from '../data/pcParts';

// ===== Backup.js =====
const Backup = ({ setRoute }) => {
  const [backupCode, setBackupCode] = useState('');
  const [restoreCode, setRestoreCode] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });
  const closeToast = () => setToast({ ...toast, open: false });
  
  // ==========================================
  // 1. GERAR CÓDIGO CRIPTOGRAFADO (BASE64)
  // ==========================================
  const handleGenerateBackup = () => {
    try {
      const setupsStr = localStorage.getItem("pcBuilderSetups") || "{}";
      const customStr = localStorage.getItem("pcBuilderCustomParts") || "[]";
      
      // Se estiver tudo vazio, avisa
      if (setupsStr === "{}" && customStr === "[]") {
        return showToast("A oficina está vazia! Não há dados para fazer backup.", "warning");
      }
      
      // Junta os PCs e as Peças Manuais num pacote só
      const pacoteDeDados = JSON.stringify({
        setups: JSON.parse(setupsStr),
        custom: JSON.parse(customStr)
      });
      
      // Criptografa para Base64 de forma segura
      const encrypted = btoa(encodeURIComponent(pacoteDeDados));
      setBackupCode(encrypted);
      showToast("Código de segurança gerado com sucesso!", "success");
    } catch (error) {
      showToast("Erro ao gerar o código. Os dados podem estar corrompidos.", "error");
      console.error(error);
    }
  };
  
  // ==========================================
  // 2. COPIAR CÓDIGO
  // ==========================================
  const handleCopyBackup = () => {
    if (!backupCode) return showToast("Gere o backup primeiro!", "warning");
    
    // Tenta usar a API de cópia do celular
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(backupCode)
        .then(() => showToast("Código copiado! Guarde-o num local seguro.", "info"))
        .catch(() => showToast("O celular bloqueou a cópia. Selecione o texto e copie manualmente!", "warning"));
    } else {
      // Fallback se não for HTTPS
      showToast("Selecione o texto na caixa abaixo e copie manualmente.", "warning");
    }
  };
  
  // ==========================================
  // 3. RESTAURAR CÓDIGO
  // ==========================================
  const handleRestoreBackup = () => {
    const codeLimpo = restoreCode.trim();
    if (!codeLimpo) return showToast("Cole o código primeiro!", "warning");
    
    try {
      // Descriptografa o código
      const decrypted = decodeURIComponent(atob(codeLimpo));
      const dadosRestaurados = JSON.parse(decrypted);
      
      // Validação de segurança e Restauração
      if (dadosRestaurados.setups) {
        localStorage.setItem("pcBuilderSetups", JSON.stringify(dadosRestaurados.setups));
      }
      if (dadosRestaurados.custom) {
        localStorage.setItem("pcBuilderCustomParts", JSON.stringify(dadosRestaurados.custom));
      }
      
      setRestoreCode('');
      showToast("Sucesso! Oficina restaurada. Recarregando...", "success");
      
      // Recarrega a página para reinjetar as peças custom no dbPcParts em memória
      setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
      showToast("Erro! O código está incompleto, inválido ou corrompido.", "error");
      console.error(e);
    }
  };
  
  // GameHeader é global (definido em app.js)
  
  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', py: 4, px: 2 }}>
      
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" color="error" onClick={() => setRoute('home')} sx={{ fontWeight: 'bold' }}>
          ◀ Voltar
        </Button>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>{toast.message}</Alert>
      </Snackbar>

      <Card sx={{ p: 0, overflow: 'hidden', border: '3px solid #b45309' }}>
        <GameHeader title="💾 Proteção de Dados (Backup)" />
        
        <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#e2d5b5' }}>
          
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1.2rem', mb: 0.5, textTransform: 'uppercase' }}>
              1. Criar Cópia (Exportar)
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.9rem', mb: 3, lineHeight: 1.4 }}>
              Gere um código de texto que contém todos os computadores montados e peças manuais. Envie esse código para o seu e-mail ou WhatsApp para segurança.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="contained" color="success" size="large" onClick={handleGenerateBackup} sx={{ flex: 1, fontWeight: '900' }}>
                Gerar Código
              </Button>
              <Button variant="contained" color="info" size="large" onClick={handleCopyBackup} disabled={!backupCode} sx={{ fontWeight: '900' }}>
                Copiar
              </Button>
            </Box>

            {backupCode && (
              <TextField 
                fullWidth 
                multiline 
                rows={4} // Multi-linha para o código caber sem "bugar"
                value={backupCode} 
                InputProps={{ readOnly: true }} 
                sx={{ bgcolor: '#ebdcb8', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', color: 'primary.main', fontSize: '0.75rem', fontFamily: 'monospace', '& fieldset': { borderColor: '#a6834d' } } }} 
              />
            )}
          </Box>

          <Divider sx={{ my: 4, borderColor: '#a6834d', opacity: 0.4 }} />

          <Box>
            <Typography sx={{ color: 'error.main', fontWeight: 900, fontSize: '1.2rem', mb: 0.5, textTransform: 'uppercase' }}>
              2. Restaurar Cópia (Importar)
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.9rem', mb: 3, lineHeight: 1.4 }}>
              Cole o código gigante gerado anteriormente para recuperar as suas listas. <strong style={{ color: '#941818' }}>Aviso:</strong> Isto irá substituir as configurações atuais do aparelho.
            </Typography>
            
            <TextField 
              fullWidth 
              multiline
              rows={4} // Multi-linha para facilitar a colagem no celular
              placeholder="Cole o código criptografado aqui..." 
              value={restoreCode} 
              onChange={(e) => setRestoreCode(e.target.value)} 
              sx={{ mb: 2, bgcolor: '#ebdcb8', borderRadius: '4px', '& .MuiOutlinedInput-root': { fontWeight: 'bold', fontSize: '0.75rem', fontFamily: 'monospace', '& fieldset': { borderColor: '#a6834d' } } }} 
            />
            
            <Button fullWidth variant="contained" color="error" size="large" onClick={handleRestoreBackup} sx={{ fontWeight: '900' }}>
              Restaurar Backup Agora
            </Button>
          </Box>

        </Box>
      </Card>
    </Box>
  );
};


export default Backup;
