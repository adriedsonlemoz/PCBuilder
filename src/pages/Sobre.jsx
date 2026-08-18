import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, AppBar, Box, Button, Card, Chip, Collapse, Container, CssBaseline,
  Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, Grid,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Slider,
  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField,
  ThemeProvider, Toolbar, Tooltip, Typography, createTheme
} from '@mui/material';
import GameHeader from '../components/GameHeader';

// ===== Sobre.js =====
// GameHeader é global (definido em app.js)

const Sobre = ({ setRoute }) => {
  // Estados para os Pop-ups
  const [openApoio, setOpenApoio] = useState(false);
  const [openContato, setOpenContato] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [logErros, setLogErros] = useState([]);

  // Quando o componente carrega, ele puxa o Log de Erros salvo no ErrorBoundary (se existir)
  useEffect(() => {
    try {
      const errosSalvos = JSON.parse(localStorage.getItem('pcBuilder_ErrorLog') || '[]');
      setLogErros(errosSalvos);
    } catch (e) {
      console.log("Nenhum log de erro encontrado.");
    }
  }, []);

  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });
  const closeToast = () => setToast({ ...toast, open: false });

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} copiado com sucesso!`, 'success');
  };

  const handleClearLog = () => {
    localStorage.removeItem('pcBuilder_ErrorLog');
    setLogErros([]);
    showToast('Log de erros esvaziado!', 'success');
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', pb: 4, pt: 2, px: { xs: 1, sm: 0 } }}>
      
      {/* BOTÃO VOLTAR */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="error" onClick={() => setRoute('home')} sx={{ fontWeight: '900' }}>
          ◀ Voltar à Garagem
        </Button>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 7 }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* =========================================================
          POP-UPS (DIALOGS) DE APOIO E CONTATO
          ========================================================= */}
      <Dialog open={openApoio} onClose={() => setOpenApoio(false)} PaperProps={{ sx: { bgcolor: '#ebdcb8', borderRadius: '8px', border: '3px solid #b45309', p: 1, textAlign: 'center' } }}>
        <DialogTitle sx={{ color: '#b45309', fontWeight: 900, fontSize: '1.3rem', pb: 0 }}>💎 Apoiar o Projeto</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', fontWeight: 'bold', mb: 2 }}>
            Esta Oficina Tática é mantida com esforço e muito café. Se as ferramentas ajudaram a montar a sua máquina de guerra, considere apoiar o engenheiro!
          </Typography>
          <Box sx={{ p: 2, bgcolor: '#e2d5b5', borderRadius: '6px', border: '2px dashed #a6834d' }}>
            <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', mb: 0.5 }}>Chave PIX:</Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '1.3rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '1px' }}>
              [INSERIR PIX AQUI]
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenApoio(false)} sx={{ color: 'text.secondary', fontWeight: 900 }}>Fechar</Button>
          <Button variant="contained" color="success" onClick={() => handleCopy('[INSERIR PIX AQUI]', 'Chave PIX')} sx={{ fontWeight: 900 }}>Copiar PIX</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openContato} onClose={() => setOpenContato(false)} PaperProps={{ sx: { bgcolor: '#ebdcb8', borderRadius: '8px', border: '3px solid #118a8b', p: 1, textAlign: 'center' } }}>
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1.3rem', pb: 0 }}>📬 Linha Direta</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', fontWeight: 'bold', mb: 2 }}>
            Encontrou alguma peça incompatível? O orçamento falhou? Envie um relatório tático para a engenharia central.
          </Typography>
          <Box sx={{ p: 2, bgcolor: '#e2d5b5', borderRadius: '6px', border: '2px dashed #118a8b' }}>
            <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', mb: 0.5 }}>E-mail de Suporte:</Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '1.1rem', fontWeight: 900, fontFamily: 'monospace' }}>
              engenharia@oficinatatica.com
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenContato(false)} sx={{ color: 'text.secondary', fontWeight: 900 }}>Fechar</Button>
          <Button variant="contained" color="info" onClick={() => handleCopy('engenharia@oficinatatica.com', 'E-mail')} sx={{ fontWeight: 900 }}>Copiar E-mail</Button>
        </DialogActions>
      </Dialog>

      {/* =========================================================
          1. INFORMAÇÕES GERAIS
          ========================================================= */}
      <Card sx={{ mb: 3, p: 0, overflow: 'hidden', border: '3px solid #118a8b' }}>
        <GameHeader title="Oficina Tática PC Builder" />
        <Box sx={{ p: 3, bgcolor: '#e2d5b5', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '4rem', filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3))', lineHeight: 1, mb: 1 }}>
            🛠️
          </Typography>
          <Typography sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1.5rem', textTransform: 'uppercase' }}>
            Versão 1.0.8
          </Typography>
          <Typography sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.9rem', mb: 2 }}>
            Codinome: "Gargalo Zero"
          </Typography>
          <Divider sx={{ borderColor: '#a6834d', opacity: 0.5, mb: 2 }} />
          <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', textAlign: 'justify', fontWeight: 'bold' }}>
            Este simulador de hardware foi forjado para auxiliar os construtores a otimizarem o seu orçamento, evitarem incompatibilidades físicas e medirem o poder de fogo da sua máquina com precisão antes de a comprar.
          </Typography>
        </Box>
      </Card>

      {/* =========================================================
          2. REGISTRO DE ATUALIZAÇÕES (CHANGELOG)
          ========================================================= */}
      <Card sx={{ mb: 3, p: 0, overflow: 'hidden', border: '3px solid #a6834d' }}>
        <GameHeader title="Últimas Atualizações" />
        <Box sx={{ p: 2, bgcolor: '#ebdcb8' }}>
          <List disablePadding>
            
            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>🌟</Typography></ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v2.0.0" size="small" sx={{ bgcolor: 'error.main', color: '#fff', fontWeight: 'bold' }} /> 
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Benchmark Automático</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Implementação do sistema de classificação de peças por estrelas e diagnóstico inteligente de gargalos de RAM e Vídeo no relatório final.</Typography>}
              />
            </ListItem>
            <Divider sx={{ borderColor: '#a6834d', opacity: 0.3, mb: 2 }} />

            <ListItem sx={{ alignItems: 'flex-start', px: 0, pb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><Typography sx={{ fontSize: '1.5rem' }}>🛡️</Typography></ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label="v1.9.0" size="small" sx={{ bgcolor: 'success.main', color: '#fff', fontWeight: 'bold' }} /> 
                    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>Guarda-Costas de Hardware</Typography>
                  </Box>
                }
                secondary={<Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold' }}>Novo sistema Anti-Loucura impede a mistura de peças AMD/Intel, ou placas DDR4 com pentes DDR5 na adição manual.</Typography>}
              />
            </ListItem>

          </List>
        </Box>
      </Card>

      {/* =========================================================
          3. LOG DE ERROS (O CONSOLE DE DEPURAÇÃO TÁTICA)
          ========================================================= */}
      <Card sx={{ mb: 3, p: 0, overflow: 'hidden', border: '3px dashed #941818' }}>
        <Box sx={{ bgcolor: '#941818', borderBottom: '3px solid #5a0e0e', p: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#fff', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>⚠️ Console de Diagnóstico (Log)</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: '#1a1a1a', minHeight: '100px' }}>
          {logErros.length === 0 ? (
             <Typography sx={{ color: '#4caf50', fontFamily: 'monospace', fontSize: '0.85rem', textAlign: 'center' }}>
               [SISTEMA OPERACIONAL ESTÁVEL. NENHUMA FALHA REGISTRADA.]
             </Typography>
          ) : (
             <>
               <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2 }}>
                 {logErros.map((erro, index) => (
                   <Box key={index} sx={{ mb: 2, pb: 1, borderBottom: '1px solid #333' }}>
                     <Typography sx={{ color: '#ff4444', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold' }}>
                       [{erro.data}] ERRO: {erro.mensagem}
                     </Typography>
                     <Typography sx={{ color: '#aaa', fontFamily: 'monospace', fontSize: '0.7rem', mt: 0.5, wordBreak: 'break-all' }}>
                       Stack: {erro.stack ? erro.stack.substring(0, 150) + '...' : 'Stack trace indisponível'}
                     </Typography>
                   </Box>
                 ))}
               </Box>
               <Button variant="outlined" color="error" fullWidth size="small" onClick={handleClearLog} sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                 [ PURGAR DADOS CORROMPIDOS ]
               </Button>
             </>
          )}
        </Box>
      </Card>

      {/* =========================================================
          4. BOTÕES DE SUPORTE E CONTATO
          ========================================================= */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card elevation={0} sx={{ height: '100%', bgcolor: '#ebdcb8', border: '2px solid #b45309', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.1s', '&:active': { transform: 'scale(0.95)' } }} onClick={() => setOpenApoio(true)}>
            <Box sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '2rem', mb: 0.5, lineHeight: 1 }}>💎</Typography>
              <Typography sx={{ color: '#b45309', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase' }}>Apoiar Projeto</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card elevation={0} sx={{ height: '100%', bgcolor: '#ebdcb8', border: '2px solid #118a8b', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.1s', '&:active': { transform: 'scale(0.95)' } }} onClick={() => setOpenContato(true)}>
            <Box sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '2rem', mb: 0.5, lineHeight: 1 }}>📬</Typography>
              <Typography sx={{ color: '#118a8b', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase' }}>Fale Conosco</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* =========================================================
          5. AVISO LEGAL OFICIAL
          ========================================================= */}
      <Box sx={{ p: 2, bgcolor: '#e2d5b5', border: '2px dashed #a6834d', borderRadius: '8px', textAlign: 'center' }}>
        <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.85rem', mb: 1, textTransform: 'uppercase' }}>
          Arquitetura Independente
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 'bold', lineHeight: 1.4 }}>
          Este aplicativo é uma ferramenta de simulação desenvolvida de forma independente. Os preços apresentados são estimativas aproximadas para fins de orçamento tático e podem divergir do mercado real. Nenhum hardware real é comercializado nesta plataforma.
        </Typography>
      </Box>

    </Box>
  );
};


export default Sobre;
