import React, { useState } from 'react';
import { AppBar, Box, Button, Container, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Toolbar, Typography } from '@mui/material';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Sobre from './pages/Sobre';
import Backup from './pages/Backup';
import { doaTheme } from './theme/doaTheme';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const App = () => {
  const [route, setRoute] = useState('home');
  const [setupParaEditar, setSetupParaEditar] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const handleGoHome = () => { setSetupParaEditar(null); setRoute('home'); };

  const navegar = (destino) => {
    setMenuAberto(false);
    if (destino === 'home') { handleGoHome(); return; }
    setRoute(destino);
  };

  const renderComponent = () => {
    switch (route) {
      case 'home':    return <Home setRoute={setRoute} setSetupParaEditar={setSetupParaEditar} />;
      case 'builder': return <Builder setRoute={setRoute} setupParaEditar={setupParaEditar} />;
      case 'sobre':   return <Sobre setRoute={setRoute} />;
      case 'backup':  return <Backup setRoute={setRoute} />;
      default:        return <Home setRoute={setRoute} setSetupParaEditar={setSetupParaEditar} />;
    }
  };

  const rotaLabels = { home: 'Garagem', builder: 'Construtor', sobre: 'Sobre', backup: 'Backup' };
  const rotaIcons  = { home: '🏠', builder: '🛠️', sobre: 'ℹ️', backup: '💾' };
  const rotasMenu  = ['home', 'builder', 'sobre', 'backup'];

  const breadcrumb = route === 'home'
    ? [{ label: '🏠 Garagem', rota: 'home' }]
    : [
        { label: '🏠 Garagem', rota: 'home' },
        { label: `${rotaIcons[route]} ${rotaLabels[route]}`, rota: route },
      ];

  return (
    <ThemeProvider theme={doaTheme}>
      <CssBaseline />

      {/* NAVBAR */}
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main', borderBottom: '4px solid', borderColor: 'secondary.main', boxShadow: '0 4px 6px rgba(0,0,0,0.5)' }}>
        <Toolbar sx={{ minHeight: '60px', display: 'flex', justifyContent: 'space-between', px: { xs: 1.5, sm: 3 } }}>

          {/* ESQUERDA: Hambúrguer + Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box onClick={() => setMenuAberto(true)} sx={{
              cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px',
              p: '6px 8px', borderRadius: '6px', border: '2px solid', borderColor: 'secondary.main',
              bgcolor: 'rgba(0,0,0,0.2)', transition: '0.2s', '&:hover': { bgcolor: 'rgba(0,0,0,0.35)' }
            }}>
              {[0,1,2].map(i => (
                <Box key={i} sx={{ width: 20, height: 2.5, bgcolor: 'primary.contrastText', borderRadius: 1 }} />
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {breadcrumb.map((item, idx) => (
                <Box key={item.rota} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {idx > 0 && (
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: '900', fontSize: '0.9rem', mx: 0.2 }}>›</Typography>
                  )}
                  <Typography
                    onClick={() => item.rota !== route && navegar(item.rota)}
                    sx={{
                      color: idx === breadcrumb.length - 1 ? 'primary.contrastText' : 'rgba(255,255,255,0.65)',
                      fontWeight: '900',
                      fontSize: { xs: '0.85rem', sm: '1rem' },
                      textShadow: '1px 2px 3px rgba(0,0,0,0.6)',
                      cursor: item.rota !== route ? 'pointer' : 'default',
                      textDecoration: item.rota !== route ? 'underline' : 'none',
                      textDecorationColor: 'rgba(255,255,255,0.4)',
                      transition: '0.15s',
                      '&:hover': item.rota !== route ? { color: '#fff' } : {},
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* DIREITA: botão Voltar (fora da Home) */}
          {route !== 'home' && (
            <Button variant="contained" color="error" size="small" onClick={handleGoHome} sx={{ py: 0.5, fontWeight: '900' }}>
              ◀ Voltar
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer anchor="left" open={menuAberto} onClose={() => setMenuAberto(false)}
        PaperProps={{ sx: { bgcolor: '#ebdcb8', width: 240, borderRight: '3px solid #a6834d' } }}>
        <Box sx={{ bgcolor: 'primary.main', p: 2, borderBottom: '3px solid #a6834d' }}>
          <Typography sx={{ color: 'primary.contrastText', fontWeight: '900', fontSize: '1.1rem', textShadow: '1px 2px 2px rgba(0,0,0,0.5)' }}>
            🖥️ PC BUILDER
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: '0.75rem' }}>
            Navegação
          </Typography>
        </Box>
        <List sx={{ pt: 1 }}>
          {rotasMenu.map((r) => (
            <ListItem key={r} disablePadding>
              <ListItemButton onClick={() => navegar(r)} selected={route === r} sx={{
                py: 1.5, px: 2,
                borderLeft: route === r ? '4px solid' : '4px solid transparent',
                borderColor: route === r ? 'primary.main' : 'transparent',
                bgcolor: route === r ? 'rgba(17,138,139,0.1)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(17,138,139,0.08)' },
              }}>
                <ListItemIcon sx={{ minWidth: 36, fontSize: '1.3rem' }}>{rotaIcons[r]}</ListItemIcon>
                <ListItemText primary={rotaLabels[r]}
                  primaryTypographyProps={{ fontWeight: route === r ? '900' : 'bold', color: route === r ? 'primary.main' : '#362414', fontSize: '0.95rem' }} />
                {route === r && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* CONTEÚDO */}
      <Container maxWidth={false} disableGutters sx={{ py: 3, minHeight: 'calc(100vh - 120px)' }}>
        {renderComponent()}
      </Container>

      {/* RODAPÉ */}
      <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: 'primary.main', borderTop: '4px solid', borderColor: 'secondary.main' }}>
        <Typography variant="caption" sx={{ color: 'primary.contrastText', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          PC Builder Ultimate · Organização Tática
        </Typography>
      </Box>
    </ThemeProvider>
  );
};


export default App;
