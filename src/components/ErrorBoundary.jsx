import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { clearAllUserData, errorStorage } from '../services/storage';

// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '', errorStack: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Erro desconhecido' };
  }
  componentDidCatch(error, errorInfo) {
    const stack = errorInfo?.componentStack || '';
    this.setState({ errorStack: stack });
    try {
      const logsAntigos = errorStorage.read();
      errorStorage.write([{ data: new Date().toLocaleString('pt-BR'), mensagem: error.message || 'Erro Desconhecido', stack, tipo: 'boundary' }, ...logsAntigos].slice(0, 30));
    } catch (e) {}
  }
  limparCacheERecarregar = () => {
    clearAllUserData();
    window.location.reload();
  };
  copiarErro = () => {
    const txt = `ERRO: ${this.state.errorMsg}\n\nCOMPONENTE:\n${this.state.errorStack}`;
    navigator.clipboard?.writeText(txt).catch(() => {});
  };
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#d6c8a3', color: '#362414', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '5rem', mb: 1, lineHeight: 1 }}>💥</Typography>
          <Typography variant="h5" sx={{ fontWeight: '900', color: '#941818', mb: 1, textTransform: 'uppercase' }}>
            O Sistema Entrou em Colapso!
          </Typography>

          {/* Caixa com o erro real */}
          <Box sx={{
            mt: 1, mb: 3, p: 2, maxWidth: 680, width: '100%',
            bgcolor: '#2a1a1a', borderRadius: '8px', border: '2px solid #941818',
            textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <Typography sx={{ color: '#ff6b6b', fontWeight: '900', fontSize: '0.8rem', textTransform: 'uppercase', mb: 0.5, letterSpacing: 1 }}>
              ⚠️ Mensagem de Erro
            </Typography>
            <Typography sx={{ color: '#ffcccc', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 'bold', wordBreak: 'break-word', mb: 1.5 }}>
              {this.state.errorMsg}
            </Typography>
            {this.state.errorStack && (
              <>
                <Typography sx={{ color: '#ff6b6b', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase', mb: 0.5, letterSpacing: 1 }}>
                  📍 Componente
                </Typography>
                <Box sx={{ maxHeight: 120, overflowY: 'auto', bgcolor: '#1a0f0f', borderRadius: '4px', p: 1 }}>
                  <Typography sx={{ color: '#e8a0a0', fontFamily: 'monospace', fontSize: '0.72rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {this.state.errorStack.trim().substring(0, 600)}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="contained" color="info" onClick={() => window.location.reload()} sx={{ fontWeight: '900', py: 1.5, px: 3 }}>🔄 Reiniciar</Button>
            <Button variant="contained" onClick={this.copiarErro} sx={{ fontWeight: '900', py: 1.5, px: 3, bgcolor: '#5a3a1a', '&:hover': { bgcolor: '#7a5a2a' } }}>📋 Copiar Erro</Button>
            <Button variant="contained" color="error" onClick={this.limparCacheERecarregar} sx={{ fontWeight: '900', py: 1.5, px: 3 }}>🗑️ Apagar Dados Locais</Button>
          </Box>
        </Box>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default ErrorBoundary;
