import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, AppBar, Box, Button, Card, Chip, Collapse, Container, CssBaseline,
  Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, Grid,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Slider,
  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField,
  ThemeProvider, Toolbar, Tooltip, Typography, createTheme
} from '@mui/material';
import GameHeader from '../components/GameHeader';
import { categoryKeys, categoryNames, dbPcParts, preDefinidos } from '../data/pcParts';

// ===== Home.js =====
// GameHeader é global (definido em app.js)

const formatarMoeda = (valor) => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// ── Componente separado para o conteúdo do modal de comparação ──
const ComparadorConteudo = ({ comparar1, comparar2, calcularTotalSetup, fechar }) => {
  const total1 = calcularTotalSetup(comparar1);
  const total2 = calcularTotalSetup(comparar2);
  const diffTotal = total1 - total2;

  const getPreco = (s, cat) => {
    const sel = s.parts?.[cat];
    if (!sel || (Array.isArray(sel) && sel.length === 0)) return 0;
    const lista = (cat === 'mb' || cat === 'cpu') ? (dbPcParts[cat][s.parts?.socket] || []) : (dbPcParts[cat] || []);
    const ids = Array.isArray(sel) ? sel : [sel];
    return ids.reduce((sum, id) => { const p = lista.find(x => x.id === id); return sum + (p?.price || 0); }, 0);
  };

  const getNome = (s, cat) => {
    const sel = s.parts?.[cat];
    if (!sel || (Array.isArray(sel) && sel.length === 0)) return '-';
    const lista = (cat === 'mb' || cat === 'cpu') ? (dbPcParts[cat][s.parts?.socket] || []) : (dbPcParts[cat] || []);
    const ids = Array.isArray(sel) ? sel : [sel];
    const cnt = {};
    ids.forEach(id => cnt[id] = (cnt[id] || 0) + 1);
    return Object.keys(cnt).map(id => { const p = lista.find(x => x.id === id); return p ? `${cnt[id] > 1 ? cnt[id] + 'x ' : ''}${p.name}` : id; }).join(' + ');
  };

  // Estilos reutilizáveis das células
  const cellBase = {
    fontSize: '0.72rem',
    py: 0.7,
    px: { xs: 0.4, sm: 0.8 },
    verticalAlign: 'top',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  };
  const cellCat = { ...cellBase, fontWeight: '900', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', whiteSpace: 'nowrap', width: '10%' };
  const cellSetup1 = (diff) => ({ ...cellBase, fontWeight: diff ? '900' : 'bold', color: diff ? 'primary.main' : 'text.primary', textAlign: 'center', bgcolor: 'rgba(17,138,139,0.05)', width: '36%' });
  const cellSetup2 = (diff) => ({ ...cellBase, fontWeight: diff ? '900' : 'bold', color: diff ? '#a6834d' : 'text.primary', textAlign: 'center', bgcolor: 'rgba(166,131,77,0.05)', width: '36%' });
  const cellDiff = { ...cellBase, textAlign: 'center', width: '18%' };

  return (
    <>
      <GameHeader title={`⚖️ ${comparar1.nome}  vs  ${comparar2.nome}`} fontSize="0.95rem" />
      <DialogContent sx={{ p: { xs: 0.5, sm: 1 }, overflow: 'hidden' }}>
        <Table size="small" sx={{ tableLayout: 'auto', width: '100%', borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...cellCat, color: 'text.secondary', fontWeight: '900', fontSize: '0.65rem' }}>Cat.</TableCell>
              <TableCell sx={{ fontWeight: '900', color: 'primary.main', fontSize: '0.75rem', textAlign: 'center', bgcolor: 'rgba(17,138,139,0.08)', px: { xs: 0.4, sm: 0.8 }, py: 0.6, wordBreak: 'break-word', width: '36%' }}>
                {comparar1.nome}
              </TableCell>
              <TableCell sx={{ fontWeight: '900', color: '#a6834d', fontSize: '0.75rem', textAlign: 'center', bgcolor: 'rgba(166,131,77,0.08)', px: { xs: 0.4, sm: 0.8 }, py: 0.6, wordBreak: 'break-word', width: '36%' }}>
                {comparar2.nome}
              </TableCell>
              <TableCell sx={{ fontWeight: '900', color: 'text.secondary', fontSize: '0.65rem', textAlign: 'center', textTransform: 'uppercase', px: { xs: 0.4, sm: 0.8 }, py: 0.6, width: '18%' }}>
                Diferença
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryKeys.map(cat => {
              const v1 = getNome(comparar1, cat);
              const v2 = getNome(comparar2, cat);
              const p1 = getPreco(comparar1, cat);
              const p2 = getPreco(comparar2, cat);
              const diff = v1 !== v2;
              const priceDiff = p1 - p2;
              const ambosZero = p1 === 0 && p2 === 0;
              return (
                <TableRow key={cat} sx={{ bgcolor: diff ? 'rgba(148,24,24,0.04)' : 'transparent' }}>
                  <TableCell sx={cellCat}>
                    {categoryNames[cat]?.split(' ').slice(1).join(' ')}
                  </TableCell>
                  <TableCell sx={cellSetup1(diff)}>
                    {v1}
                    {p1 > 0 && <Typography component="div" sx={{ fontSize: '0.62rem', color: 'text.secondary', fontWeight: 'bold', mt: 0.2 }}>{formatarMoeda(p1)}</Typography>}
                  </TableCell>
                  <TableCell sx={cellSetup2(diff)}>
                    {v2}
                    {p2 > 0 && <Typography component="div" sx={{ fontSize: '0.62rem', color: 'text.secondary', fontWeight: 'bold', mt: 0.2 }}>{formatarMoeda(p2)}</Typography>}
                  </TableCell>
                  <TableCell sx={cellDiff}>
                    {!ambosZero && priceDiff !== 0 ? (
                      <Box>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: '900', color: priceDiff > 0 ? '#a6834d' : 'primary.main', display: 'block' }}>
                          {priceDiff > 0 ? `+${formatarMoeda(priceDiff)}` : `-${formatarMoeda(Math.abs(priceDiff))}`}
                        </Typography>
                        <Typography sx={{ fontSize: '0.58rem', fontWeight: 'bold', color: 'text.secondary', display: 'block' }}>
                          {priceDiff > 0 ? `${comparar1.nome.split(' ')[0]} +caro` : `${comparar2.nome.split(' ')[0]} +caro`}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 'bold' }}>—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow sx={{ bgcolor: 'rgba(50,168,82,0.08)' }}>
              <TableCell sx={{ ...cellCat, color: 'success.main' }}>💰 Total</TableCell>
              <TableCell sx={{ fontWeight: '900', color: 'success.main', textAlign: 'center', fontSize: '0.85rem', bgcolor: 'rgba(17,138,139,0.05)', px: { xs: 0.4, sm: 0.8 }, py: 0.8 }}>
                {formatarMoeda(total1)}
              </TableCell>
              <TableCell sx={{ fontWeight: '900', color: 'success.main', textAlign: 'center', fontSize: '0.85rem', bgcolor: 'rgba(166,131,77,0.05)', px: { xs: 0.4, sm: 0.8 }, py: 0.8 }}>
                {formatarMoeda(total2)}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', px: { xs: 0.4, sm: 0.8 }, py: 0.8 }}>
                {diffTotal !== 0 && (
                  <Box>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: '900', color: diffTotal > 0 ? '#a6834d' : 'primary.main', display: 'block' }}>
                      {diffTotal > 0 ? `+${formatarMoeda(diffTotal)}` : `-${formatarMoeda(Math.abs(diffTotal))}`}
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', fontWeight: '900', color: diffTotal < 0 ? 'success.main' : 'error.main', bgcolor: diffTotal < 0 ? 'rgba(50,168,82,0.1)' : 'rgba(148,24,24,0.1)', px: 0.6, borderRadius: '4px', display: 'inline-block', mt: 0.3 }}>
                      {diffTotal < 0 ? `${comparar1.nome.split(' ')[0]} mais barato` : `${comparar2.nome.split(' ')[0]} mais barato`}
                    </Typography>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ p: 1, justifyContent: 'center' }}>
        <Button variant="contained" color="error" size="small" onClick={fechar}>Fechar</Button>
      </DialogActions>
    </>
  );
};

const Home = ({ setRoute, setSetupParaEditar }) => {
  const [savedSetups, setSavedSetups] = useState({});
  const [modalApagarAberto, setModalApagarAberto] = useState(false);
  const [setupParaApagar, setSetupParaApagar] = useState(null);
  
  const [modalVerAberto, setModalVerAberto] = useState(false);
  const [setupSelecionado, setSetupSelecionado] = useState(null);
  const [abaHistorico, setAbaHistorico] = useState(false); // false = peças, true = histórico
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Comparador
  const [modalCompararAberto, setModalCompararAberto] = useState(false);
  const [comparar1, setComparar1] = useState(null);
  const [comparar2, setComparar2] = useState(null);
  const [selecionandoComparar, setSelecionandoComparar] = useState(false);

  // Modo Upgrade
  const [modalUpgradeAberto, setModalUpgradeAberto] = useState(false);
  const [setupParaUpgrade, setSetupParaUpgrade] = useState(null);
  const [orcamentoUpgrade, setOrcamentoUpgrade] = useState(500);

  // Pop-up de erros em tempo real
  const [erroPopup, setErroPopup] = useState(null);

  // Carrega os dados blindado contra erros
  useEffect(() => {
    try {
      const localData = localStorage.getItem("pcBuilderSetups");
      setSavedSetups(localData ? JSON.parse(localData) : {});
    } catch (error) {
      console.error("Erro ao carregar setups salvos:", error);
      setSavedSetups({});
    }
  }, []);

  // Intercepta erros globais e mostra pop-up
  useEffect(() => {
    const logErroOriginal = window.pcBuilderLogErro;
    window.pcBuilderLogErro = (mensagem, stack, tipo) => {
      if (logErroOriginal) logErroOriginal(mensagem, stack, tipo);
      if (tipo !== 'validacao') {
        setErroPopup({ mensagem: String(mensagem).substring(0, 200), tipo: tipo || 'js' });
      }
    };
    const handleGlobalError = (event) => {
      setErroPopup({ mensagem: event.message || 'Erro JavaScript desconhecido', tipo: 'js' });
    };
    const handleRejection = (event) => {
      setErroPopup({ mensagem: `Promise rejeitada: ${event.reason?.message || String(event.reason)}`, tipo: 'promise' });
    };
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.pcBuilderLogErro = logErroOriginal;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });
  const closeToast = () => setToast({ ...toast, open: false });

  const getPecaDados = (cat, id, socket) => {
    if (typeof dbPcParts === 'undefined' || !dbPcParts[cat]) return { name: "Peça não encontrada", price: 0 };
    let lista = (cat === 'mb' || cat === 'cpu') ? (dbPcParts[cat][socket] || []) : (dbPcParts[cat] || []);
    return lista.find(p => p.id === id) || { name: "Peça não encontrada", price: 0 };
  };

  const abrirVisualizacao = (nome, isPreset = false) => {
    const dados = isPreset ? preDefinidos[nome] : savedSetups[nome];
    setSetupSelecionado({ nome, ...dados });
    setModalVerAberto(true);
  };

  const handleCompartilhar = () => {
    if (!setupSelecionado) return;
    let texto = `🖥️ OFICINA - SETUP: ${setupSelecionado.nome}\n`;
    texto += `📅 Data: ${setupSelecionado.date || ''} | Plataforma: ${setupSelecionado.socketInfo || ''}\n\n`;

    if (typeof categoryKeys !== 'undefined') {
      categoryKeys.forEach(cat => {
        const selection = setupSelecionado.parts?.[cat];
        if (!selection || (Array.isArray(selection) && selection.length === 0)) return;
        
        const ids = Array.isArray(selection) ? selection : [selection];
        const contagem = {};
        ids.forEach(id => contagem[id] = (contagem[id] || 0) + 1);
        
        Object.keys(contagem).forEach(id => {
          const peca = getPecaDados(cat, id, setupSelecionado.parts?.socket);
          let nomeCategoriaLimpo = cat;
          if (typeof categoryNames !== 'undefined' && categoryNames[cat]) {
             const partesNome = categoryNames[cat].split(' ');
             partesNome.shift(); 
             nomeCategoriaLimpo = partesNome.join(' ').toUpperCase();
          }
          const prefixo = contagem[id] > 1 ? `${contagem[id]}x ` : '';
          texto += `• ${nomeCategoriaLimpo}: ${prefixo}${peca.name}\n`;
        });
      });
    }
    
    texto += `\n💰 TOTAL: ${setupSelecionado.total || 'R$ 0,00'}`;
    navigator.clipboard.writeText(texto)
      .then(() => showToast('Setup copiado com sucesso!', 'success'))
      .catch(() => showToast('Erro ao copiar!', 'error'));
  };

  const confirmarApagar = () => {
    const novosSetups = { ...savedSetups };
    delete novosSetups[setupParaApagar];
    localStorage.setItem("pcBuilderSetups", JSON.stringify(novosSetups));
    if (window.pcBuilderLogAcao) window.pcBuilderLogAcao('Setup apagado', `Nome: "${setupParaApagar}"`);
    setSavedSetups(novosSetups);
    setModalApagarAberto(false);
    setSetupParaApagar(null);
  };

  const handleSelecionarParaComparar = (nome, isPreset = false) => {
    const dados = isPreset ? { nome, ...preDefinidos[nome] } : { nome, ...savedSetups[nome] };
    if (!comparar1) { setComparar1(dados); }
    else if (!comparar2 && dados.nome !== comparar1.nome) { setComparar2(dados); setSelecionandoComparar(false); setModalCompararAberto(true); }
  };

  const todasListas = { ...savedSetups, ...Object.fromEntries(Object.keys(preDefinidos).map(k => [k, preDefinidos[k]])) };

  const calcularTotalSetup = (setupObj) => {
    if (!setupObj || !setupObj.parts) return 0;
    let sum = 0;
    categoryKeys.forEach(cat => {
      const sel = setupObj.parts[cat];
      if (!sel) return;
      const lista = (cat === 'mb' || cat === 'cpu') ? (dbPcParts[cat][setupObj.parts.socket] || []) : (dbPcParts[cat] || []);
      const ids = Array.isArray(sel) ? sel : [sel];
      ids.forEach(id => { const p = lista.find(x => x.id === id); if (p) sum += p.price; });
    });
    return sum;
  };

  // Calcula sugestões de upgrade dado um orçamento extra
  const sugestoesUpgrade = useMemo(() => {
    if (!setupParaUpgrade || !setupParaUpgrade.parts || orcamentoUpgrade <= 0) return [];
    const parts = setupParaUpgrade.parts;
    const socket = parts.socket;
    const sugestoes = [];

    // Categorias impactantes para upgrade
    const catsUpgrade = [
      { cat: 'gpu', label: '🎮 Placa Gráfica', multiple: true },
      { cat: 'cpu', label: '🧠 Processador', multiple: false },
      { cat: 'ram', label: '⚡ Memória RAM', multiple: true },
      { cat: 'storage', label: '💾 Armazenamento', multiple: true },
      { cat: 'psu', label: '🔋 Fonte', multiple: false },
      { cat: 'monitor', label: '🖥️ Monitor', multiple: false },
    ];

    catsUpgrade.forEach(({ cat, label, multiple }) => {
      const lista = (cat === 'mb' || cat === 'cpu') ? (dbPcParts[cat][socket] || []) : (dbPcParts[cat] || []);
      if (!lista || lista.length === 0) return;

      // Preço atual da peça selecionada
      const selAtual = parts[cat];
      if (!selAtual) return;
      const idsAtuais = Array.isArray(selAtual) ? selAtual : [selAtual];
      // Para múltiplos, usar preço da mais cara individualmente
      const precoAtual = Math.max(...idsAtuais.map(id => (lista.find(p => p.id === id) || { price: 0 }).price));
      const pecaAtual = lista.find(p => p.id === (Array.isArray(selAtual) ? selAtual[0] : selAtual));

      if (precoAtual <= 0) return;

      // Encontrar melhor upgrade dentro do orçamento
      const candidatos = lista
        .filter(p => p.price > precoAtual && (p.price - precoAtual) <= orcamentoUpgrade)
        .sort((a, b) => b.price - a.price);

      if (candidatos.length === 0) return;
      const melhor = candidatos[0];
      const diferenca = melhor.price - precoAtual;

      sugestoes.push({
        cat, label,
        atual: pecaAtual?.name || 'Atual',
        precoAtual,
        sugerido: melhor.name,
        precoSugerido: melhor.price,
        diferenca,
        impacto: cat === 'gpu' ? 5 : cat === 'cpu' ? 4 : cat === 'ram' ? 3 : 2,
      });
    });

    // Ordenar por impacto e depois por diferença de preço
    return sugestoes.sort((a, b) => b.impacto - a.impacto || a.diferenca - b.diferenca);
  }, [setupParaUpgrade, orcamentoUpgrade]);

  // Restaurar uma versão do histórico
  const handleRestaurarVersao = (nome, versao) => {
    const allSetups = JSON.parse(localStorage.getItem("pcBuilderSetups") || "{}");
    if (!allSetups[nome]) return;
    const historico = allSetups[nome].history || [];
    const versaoAtual = { ...allSetups[nome] };
    delete versaoAtual.history;
    // Colocar atual no histórico e restaurar a versão escolhida
    historico.unshift(versaoAtual);
    allSetups[nome] = { ...versao, history: historico.slice(0, 10) };
    localStorage.setItem("pcBuilderSetups", JSON.stringify(allSetups));
    if (window.pcBuilderLogAcao) window.pcBuilderLogAcao('Versão restaurada', `Setup: "${nome}" | Versão de ${versao.date}`);
    setSavedSetups({ ...allSetups });
    setSetupSelecionado({ nome, ...allSetups[nome] });
    setAbaHistorico(false);
    showToast('Versão restaurada com sucesso!', 'success');
  };

  return (
    <Box sx={{ width: '95%', maxWidth: 1400, margin: 'auto', py: 4 }}>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} variant="filled" sx={{ fontWeight: 'bold' }}>{toast.message}</Alert>
      </Snackbar>

      {/* POP-UP DE ERROS EM TEMPO REAL */}
      <Snackbar
        open={!!erroPopup}
        autoHideDuration={8000}
        onClose={() => setErroPopup(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8, maxWidth: 520 }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErroPopup(null)}
          sx={{ fontWeight: 'bold', width: '100%', alignItems: 'flex-start' }}
        >
          <Typography sx={{ fontWeight: '900', fontSize: '0.85rem', mb: 0.3 }}>
            {erroPopup?.tipo === 'promise' ? '🔗 Promise Rejeitada' : '⚠️ Erro Detectado'}
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 'bold', opacity: 0.92, wordBreak: 'break-word' }}>
            {erroPopup?.mensagem}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', opacity: 0.7, mt: 0.5 }}>
            Ver detalhes completos em: Menu → Sobre → Console
          </Typography>
        </Alert>
      </Snackbar>

      {/* ======================================================= */}
      {/* MODAIS (VER SETUP E APAGAR) */}
      {/* ======================================================= */}
      <Dialog open={modalVerAberto} onClose={() => { setModalVerAberto(false); setAbaHistorico(false); }} fullWidth maxWidth="lg"
        PaperProps={{ sx: { bgcolor: 'background.paper', border: '3px solid #118a8b', borderRadius: '12px' } }}>
        {setupSelecionado && (
          <>
            <GameHeader title={`Visualizando: ${setupSelecionado.nome}`} fontSize="1.4rem" />
            <DialogContent sx={{ p: 0 }}>
              {/* Cabeçalho com total e abas */}
              <Box sx={{ p: 2, bgcolor: 'rgba(17,138,139,0.1)', textAlign: 'center', borderBottom: '2px solid', borderColor: 'secondary.main' }}>
                <Typography sx={{ fontWeight: '900', color: 'success.main', fontSize: '2.2rem' }}>{setupSelecionado.total || 'R$ 0,00'}</Typography>
                <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{setupSelecionado.socketInfo || 'N/A'} • {setupSelecionado.date || ''}{setupSelecionado.time ? ` às ${setupSelecionado.time}` : ''}</Typography>

                {/* Abas: Peças / Histórico */}
                {(setupSelecionado.history?.length > 0) && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1.5 }}>
                    <Button size="small" variant={!abaHistorico ? 'contained' : 'outlined'} color="primary" onClick={() => setAbaHistorico(false)}
                      sx={{ fontWeight: '900', fontSize: '0.75rem', py: 0.3 }}>📋 Peças</Button>
                    <Button size="small" variant={abaHistorico ? 'contained' : 'outlined'} color="secondary" onClick={() => setAbaHistorico(true)}
                      sx={{ fontWeight: '900', fontSize: '0.75rem', py: 0.3 }}>
                      📚 Histórico ({setupSelecionado.history?.length || 0})
                    </Button>
                  </Box>
                )}
              </Box>

              {/* ABA: PEÇAS */}
              {!abaHistorico && (
                <List sx={{ p: { xs: 1, sm: 3 } }}>
                  {categoryKeys.map(cat => {
                    const selection = setupSelecionado.parts?.[cat];
                    if (!selection || (Array.isArray(selection) && selection.length === 0)) return null;
                    const ids = Array.isArray(selection) ? selection : [selection];
                    const contagem = {};
                    ids.forEach(id => contagem[id] = (contagem[id] || 0) + 1);
                    return Object.keys(contagem).map(id => {
                      const peca = getPecaDados(cat, id, setupSelecionado.parts?.socket);
                      const subtotal = peca.price * contagem[id];
                      const nomeCat = (categoryNames[cat] || cat).split(' ').slice(1).join(' ').toUpperCase();
                      return (
                        <ListItem key={`${cat}-${id}`} divider sx={{ py: 1.5 }}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={12} sm={3}><Typography sx={{ fontWeight: '900', fontSize: '0.8rem', color: 'primary.main' }}>{nomeCat}</Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>{contagem[id] > 1 && <b style={{color:'#d32f2f', marginRight: '4px'}}>{contagem[id]}x</b>}{peca.name}</Typography></Grid>
                            <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'left', sm: 'right' } }}><Typography sx={{ fontWeight: '900', color: 'success.dark', fontSize: '1.1rem' }}>{formatarMoeda(subtotal)}</Typography></Grid>
                          </Grid>
                        </ListItem>
                      );
                    });
                  })}
                </List>
              )}

              {/* ABA: HISTÓRICO */}
              {abaHistorico && (
                <Box sx={{ p: { xs: 1, sm: 2 } }}>
                  {(setupSelecionado.history || []).length === 0 ? (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                      <Typography sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Nenhuma versão anterior guardada.</Typography>
                    </Box>
                  ) : (
                    (setupSelecionado.history || []).map((versao, idx) => (
                      <Box key={idx} sx={{ mb: 2, p: 2, border: '2px solid', borderColor: 'secondary.main', borderRadius: '8px', bgcolor: 'background.default' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box>
                            <Typography sx={{ fontWeight: '900', color: 'text.primary', fontSize: '0.95rem' }}>
                              Versão {(setupSelecionado.history || []).length - idx} — {versao.date}{versao.time ? ` às ${versao.time}` : ''}
                            </Typography>
                            <Typography sx={{ fontWeight: '900', color: 'success.main', fontSize: '1.1rem' }}>{versao.total || 'R$ 0,00'}</Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 'bold' }}>{versao.socketInfo || ''}</Typography>
                          </Box>
                          <Button variant="contained" color="warning" size="small" onClick={() => handleRestaurarVersao(setupSelecionado.nome, versao)}
                            sx={{ fontWeight: '900', fontSize: '0.75rem' }}>
                            ↩️ Restaurar
                          </Button>
                        </Box>
                        {/* Mini lista das peças da versão */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {categoryKeys.map(cat => {
                            const sel = versao.parts?.[cat];
                            if (!sel || (Array.isArray(sel) && sel.length === 0)) return null;
                            const ids = Array.isArray(sel) ? [sel[0]] : [sel];
                            const lista = (cat === 'mb' || cat === 'cpu') ? (dbPcParts[cat][versao.parts?.socket] || []) : (dbPcParts[cat] || []);
                            const peca = lista.find(p => p.id === ids[0]);
                            if (!peca || peca.price === 0) return null;
                            return (
                              <Chip key={cat} label={peca.name.split(' ').slice(0, 3).join(' ')} size="small"
                                sx={{ fontSize: '0.65rem', fontWeight: 'bold', bgcolor: 'background.paper', border: '1px solid', borderColor: 'secondary.main', color: 'text.primary' }} />
                            );
                          })}
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: 'background.default', gap: 1, flexWrap: 'wrap' }}>
              <Button onClick={handleCompartilhar} variant="contained" color="info" sx={{ fontWeight: '900', height: 42, flex: 1, minWidth: 80 }}>📤 Copiar</Button>
              <Button onClick={() => setModalVerAberto(false)} variant="contained" color="primary" sx={{ fontWeight: '900', height: 42, flex: 1, minWidth: 80 }}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={modalApagarAberto} onClose={() => setModalApagarAberto(false)} PaperProps={{ sx: { bgcolor: 'background.paper', border: '3px solid #a6834d' } }}>
        <DialogTitle sx={{ color: 'error.main', fontWeight: '900', textAlign: 'center' }}>⚠️ Apagar PC?</DialogTitle>
        <DialogContent><Typography sx={{fontWeight: 'bold', textAlign: 'center', color: 'text.primary'}}>Excluir permanentemente "{setupParaApagar}"?</Typography></DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}><Button onClick={() => setModalApagarAberto(false)} variant="contained" color="info">Cancelar</Button><Button onClick={confirmarApagar} variant="contained" color="error">Sim, Apagar</Button></DialogActions>
      </Dialog>

      {/* MODAL COMPARADOR */}
      <Dialog open={modalCompararAberto} onClose={() => { setModalCompararAberto(false); setComparar1(null); setComparar2(null); }} fullWidth maxWidth="xl"
        PaperProps={{ sx: { bgcolor: 'background.paper', border: '3px solid #118a8b', borderRadius: '12px', mx: { xs: 0.5, sm: 2 }, width: '100%' } }}>
        {comparar1 && comparar2 && <ComparadorConteudo
          comparar1={comparar1}
          comparar2={comparar2}
          calcularTotalSetup={calcularTotalSetup}
          fechar={() => { setModalCompararAberto(false); setComparar1(null); setComparar2(null); }}
        />}
      </Dialog>

      {/* MODAL MODO UPGRADE */}
      <Dialog open={modalUpgradeAberto} onClose={() => setModalUpgradeAberto(false)} fullWidth maxWidth="sm"
        PaperProps={{ sx: { bgcolor: 'background.paper', border: '3px solid #32a852', borderRadius: '12px' } }}>
        {setupParaUpgrade && (
          <>
            <GameHeader title={`🚀 Modo Upgrade: ${setupParaUpgrade.nome}`} fontSize="1rem" bgcolor="#32a852" />
            <DialogContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Typography sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.88rem', mb: 2 }}>
                Define o orçamento extra disponível e vê quais peças valem mais a pena trocar.
              </Typography>

              {/* Slider de orçamento */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: '8px', border: '2px solid', borderColor: 'secondary.main' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontWeight: '900', color: 'text.primary', fontSize: '0.9rem' }}>💰 Orçamento Extra</Typography>
                  <Typography sx={{ fontWeight: '900', color: 'success.main', fontSize: '1.3rem' }}>{formatarMoeda(orcamentoUpgrade)}</Typography>
                </Box>
                <Slider value={orcamentoUpgrade} min={100} max={5000} step={50}
                  onChange={(_, v) => setOrcamentoUpgrade(v)} sx={{ color: 'success.main' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 'bold' }}>R$ 100</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 'bold' }}>R$ 5.000</Typography>
                </Box>
              </Box>

              {/* Sugestões */}
              {sugestoesUpgrade.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🏆</Typography>
                  <Typography sx={{ fontWeight: '900', color: 'success.main' }}>Setup já maximizado!</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    Não há upgrades disponíveis dentro deste orçamento.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ fontWeight: '900', color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', mb: 1.5 }}>
                    ⬆️ Upgrades Possíveis (por impacto)
                  </Typography>
                  {sugestoesUpgrade.map((s, idx) => (
                    <Box key={s.cat} sx={{ mb: 2, p: 1.5, border: '2px solid', borderColor: idx === 0 ? 'success.main' : 'secondary.main',
                      borderRadius: '8px', bgcolor: idx === 0 ? 'rgba(50,168,82,0.06)' : 'background.default', position: 'relative' }}>
                      {idx === 0 && (
                        <Chip label="✨ Melhor Upgrade" size="small" sx={{ position: 'absolute', top: -12, left: 12,
                          bgcolor: 'success.main', color: '#fff', fontWeight: '900', fontSize: '0.65rem' }} />
                      )}
                      <Typography sx={{ fontWeight: '900', color: 'primary.main', fontSize: '0.8rem', textTransform: 'uppercase', mb: 1 }}>
                        {s.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 'bold', flex: 1, minWidth: 120 }}>
                          Atual: {s.atual.length > 30 ? s.atual.substring(0, 30) + '…' : s.atual}
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: '900', color: 'text.secondary' }}>
                          {formatarMoeda(s.precoAtual)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: 'success.main', fontWeight: '900', flex: 1, minWidth: 120 }}>
                          ➜ {s.sugerido.length > 30 ? s.sugerido.substring(0, 30) + '…' : s.sugerido}
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: '900', color: 'success.main' }}>
                            {formatarMoeda(s.precoSugerido)}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: '900', color: '#32a852', bgcolor: 'rgba(50,168,82,0.1)', px: 0.8, borderRadius: '4px' }}>
                            +{formatarMoeda(s.diferenca)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button variant="contained" color="success" fullWidth onClick={() => {
                setModalUpgradeAberto(false);
                setSetupParaEditar({ nome: setupParaUpgrade.nome, dados: setupParaUpgrade });
                setRoute('builder');
              }} sx={{ fontWeight: '900' }}>
                🛠️ Aplicar Upgrades no Builder
              </Button>
              <Button variant="contained" color="error" onClick={() => setModalUpgradeAberto(false)} sx={{ fontWeight: '900', minWidth: 80 }}>
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ======================================================= */}
      {/* 1. BOTÃO MONTAR NOVO PC */}
      {/* ======================================================= */}
      <Card sx={{ mb: 3, p: 0, overflow: 'hidden', cursor: 'pointer', transition: '0.3s', border: '3px solid', borderColor: 'secondary.main', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' } }} onClick={() => {setSetupParaEditar(null); setRoute('builder');}}>
        <Box sx={{ p: 2, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 2, sm: 4 } }}>
          <Typography sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' }, lineHeight: 1 }}>🛠️</Typography>
          <Box sx={{ textAlign: 'left' }}>
             <Typography variant="h4" sx={{ fontWeight: '900', letterSpacing: '1px', color: 'primary.main', fontSize: { xs: '1.4rem', sm: '2rem' } }}>MONTAR NOVO PC</Typography>
             <Typography sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>Inicie uma simulação do zero</Typography>
          </Box>
        </Box>
      </Card>

      {/* ======================================================= */}
      {/* 2. SUGESTÕES PRÉ-DEFINIDAS */}
      {/* ======================================================= */}
      <Divider sx={{ mb: 2.5 }}><Chip label="💡 CONFIGURAÇÕES SUGERIDAS" sx={{ fontWeight: '900', bgcolor: '#ebdcb8', border: '2px solid #a6834d', px: 2, fontSize: '0.8rem' }}/></Divider>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        {typeof preDefinidos !== 'undefined' && Object.keys(preDefinidos).map((nome) => {
          const preset = preDefinidos[nome];
          const parts = preset.parts || {};

          // Peças principais para exibir
          const getPecaNome = (cat, id) => {
            if (!id || id === 'gpu_int' || id === 'au_none') return null;
            const lista = (cat === 'mb' || cat === 'cpu') ? (dbPcParts[cat]?.[parts.socket] || []) : (dbPcParts[cat] || []);
            const p = lista.find(x => x.id === id);
            return p?.name || null;
          };
          const cpuNome = getPecaNome('cpu', parts.cpu);
          const gpuNome = getPecaNome('gpu', Array.isArray(parts.gpu) ? parts.gpu[0] : parts.gpu);
          const ramNome = getPecaNome('ram', Array.isArray(parts.ram) ? parts.ram[0] : parts.ram);
          const ramQtd = Array.isArray(parts.ram) ? parts.ram.length : 1;
          const monNome = getPecaNome('monitor', parts.monitor);

          // Nível e cor do preset baseado no preço
          const totalNum = parseFloat((preset.total || '0').replace(/[^\d,]/g,'').replace(',','.'));
          const nivel = totalNum < 3000 ? { label: 'Básico', color: '#32a852', bg: 'rgba(50,168,82,0.12)' }
                      : totalNum < 5000 ? { label: 'Intermediário', color: '#1565c0', bg: 'rgba(21,101,192,0.12)' }
                      : totalNum < 9000 ? { label: 'Avançado', color: '#a6834d', bg: 'rgba(166,131,77,0.12)' }
                      : { label: 'Elite', color: '#941818', bg: 'rgba(148,24,24,0.1)' };

          // Barra de performance (0-100)
          const perf = Math.min(100, Math.round((totalNum / 15000) * 100));
          const perfColor = perf < 30 ? '#32a852' : perf < 55 ? '#1565c0' : perf < 75 ? '#a6834d' : '#941818';

          // Ícone do perfil de uso
          const icone = nome.toLowerCase().includes('estudo') || nome.toLowerCase().includes('office') ? '📚'
                      : nome.toLowerCase().includes('league') || nome.toLowerCase().includes('lol') ? '⚔️'
                      : nome.toLowerCase().includes('gta') ? '🚗'
                      : nome.toLowerCase().includes('ea') || nome.toLowerCase().includes('sport') ? '⚽'
                      : nome.toLowerCase().includes('stream') ? '📡'
                      : nome.toLowerCase().includes('design') || nome.toLowerCase().includes('render') ? '🎨'
                      : '🎮';

          return (
            <Card key={nome} sx={{ border: '2px solid #118a8b', display: 'flex', flexDirection: 'column', bgcolor: '#f7f2e3', overflow: 'hidden', transition: '0.25s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 18px rgba(0,0,0,0.18)' } }}>
              {/* Header colorido com ícone e nome */}
              <Box sx={{ bgcolor: '#118a8b', px: 1.5, py: 1, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '2px solid #a6834d' }}>
                <Typography sx={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{icone}</Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ color: '#fff', fontWeight: '900', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {nome}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.65rem', fontWeight: 'bold' }}>
                    {preset.socketInfo}
                  </Typography>
                </Box>
                <Chip label={nivel.label} size="small" sx={{ bgcolor: nivel.bg, color: nivel.color, fontWeight: '900', fontSize: '0.6rem', border: `1px solid ${nivel.color}`, height: 20, flexShrink: 0 }} />
              </Box>

              <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Preço destaque */}
                <Typography sx={{ color: 'success.main', fontWeight: '900', fontSize: '1.25rem', lineHeight: 1, mb: 0.5 }}>
                  {preset.total}
                </Typography>

                {/* Barra de performance */}
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: '900', color: 'text.secondary', textTransform: 'uppercase' }}>Performance</Typography>
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: '900', color: perfColor }}>{perf}%</Typography>
                  </Box>
                  <Box sx={{ height: 6, bgcolor: '#d6c8a3', borderRadius: 3, overflow: 'hidden', border: '1px solid #c4b68a' }}>
                    <Box sx={{ height: '100%', width: `${perf}%`, bgcolor: perfColor, borderRadius: 3, transition: '0.4s' }} />
                  </Box>
                </Box>

                {/* Peças principais */}
                <Box sx={{ flex: 1, mb: 1.5 }}>
                  {cpuNome && (
                    <Box sx={{ display: 'flex', gap: 0.8, mb: 0.5, alignItems: 'flex-start' }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: '900', color: 'primary.main', minWidth: 28, mt: '1px' }}>CPU</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'text.primary', lineHeight: 1.3 }}>{cpuNome}</Typography>
                    </Box>
                  )}
                  {gpuNome && (
                    <Box sx={{ display: 'flex', gap: 0.8, mb: 0.5, alignItems: 'flex-start' }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: '900', color: '#a6834d', minWidth: 28, mt: '1px' }}>GPU</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'text.primary', lineHeight: 1.3 }}>{gpuNome}</Typography>
                    </Box>
                  )}
                  {!gpuNome && (
                    <Box sx={{ display: 'flex', gap: 0.8, mb: 0.5, alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: '900', color: '#a6834d', minWidth: 28 }}>GPU</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontStyle: 'italic' }}>Integrada</Typography>
                    </Box>
                  )}
                  {ramNome && (
                    <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'flex-start' }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: '900', color: 'text.secondary', minWidth: 28, mt: '1px' }}>RAM</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'text.primary', lineHeight: 1.3 }}>
                        {ramQtd > 1 ? `${ramQtd}x ` : ''}{ramNome}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Monitor se existir */}
                {monNome && (
                  <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', fontWeight: 'bold', mb: 1, bgcolor: '#ebdcb8', px: 0.8, py: 0.3, borderRadius: '4px', textAlign: 'center' }}>
                    🖥️ {monNome}
                  </Typography>
                )}

                {/* Botões */}
                <Box sx={{ display: 'flex', gap: 0.5, mt: 'auto' }}>
                  <Button fullWidth variant="contained" color="info" size="small"
                    sx={{ fontWeight: '900', py: 0.5, fontSize: '0.72rem' }}
                    onClick={() => abrirVisualizacao(nome, true)}>
                    👁️ Ver
                  </Button>
                  <Button fullWidth variant="contained" color="success" size="small"
                    sx={{ fontWeight: '900', py: 0.5, fontSize: '0.72rem' }}
                    onClick={() => { setSetupParaEditar({ nome, dados: preDefinidos[nome] }); setRoute('builder'); }}>
                    ✏️ Editar
                  </Button>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* ======================================================= */}
      {/* 3. SETUPS SALVOS */}
      {/* ======================================================= */}
      <Divider sx={{ mb: 2 }}><Chip label="MEUS SETUPS GUARDADOS" sx={{ fontWeight: '900', bgcolor: 'background.paper', border: '2px solid', borderColor: 'secondary.main', px: 2, fontSize: '0.8rem', color: 'text.primary' }}/></Divider>

      {/* Banner modo comparação */}
      {selecionandoComparar && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(17,138,139,0.15)', border: '2px solid', borderColor: 'primary.main', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontWeight: '900', color: 'primary.main', fontSize: '0.9rem' }}>
            ⚖️ {comparar1 ? `"${comparar1.nome}" selecionado — escolha o segundo setup` : 'Clique em "⚖️" num setup para comparar'}
          </Typography>
          <Button size="small" variant="contained" color="error" onClick={() => { setSelecionandoComparar(false); setComparar1(null); }} sx={{ fontSize: '0.75rem', py: 0.3 }}>Cancelar</Button>
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 4 }}>
        {Object.keys(savedSetups).length === 0 ? (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '2px dashed', borderColor: 'secondary.main' }}>
            <Typography sx={{ fontSize: '2rem', opacity: 0.5 }}>👻</Typography>
            <Typography sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.9rem' }}>Nenhum setup salvo ainda.</Typography>
          </Box>
        ) : (
          Object.keys(savedSetups).map((nome) => (
            <Card key={nome} sx={{ border: '2px solid', borderColor: selecionandoComparar && comparar1?.nome === nome ? 'primary.main' : 'secondary.main', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', height: '100%', transition: '0.2s', boxShadow: selecionandoComparar ? '0 0 10px rgba(17,138,139,0.3)' : 'none' }}>
              <GameHeader title={nome} fontSize="0.75rem" bgcolor="#a6834d" color="#fff" />
              <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center' }}>
                <Typography sx={{ color: 'success.main', fontWeight: '900', fontSize: { xs: '1.1rem', sm: '1.3rem' }, mb: 0.5 }}>
                  {savedSetups[nome]?.total || 'R$ 0,00'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontWeight: '900', color: 'text.secondary', bgcolor: 'background.default', borderRadius: '4px', py: 0.2, fontSize: '0.65rem' }}>
                  ⚙️ {savedSetups[nome]?.socketInfo || 'N/A'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 'auto' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button fullWidth variant="contained" color="info" size="small" sx={{fontWeight:'900', py: 0.2, fontSize: '0.7rem'}} onClick={() => { setAbaHistorico(false); abrirVisualizacao(nome); }}>Ver</Button>
                    <Button fullWidth variant="contained" color="success" size="small" sx={{fontWeight:'900', py: 0.2, fontSize: '0.7rem'}} onClick={() => {setSetupParaEditar({ nome, dados: savedSetups[nome] }); setRoute('builder');}}>Editar</Button>
                  </Box>
                  <Button fullWidth variant="contained" size="small"
                    sx={{ fontWeight:'900', py: 0.2, fontSize: '0.7rem', bgcolor: '#32a852', border: '2px solid #1e7a38', '&:hover': { bgcolor: '#27913f' } }}
                    onClick={() => { setSetupParaUpgrade({ nome, ...savedSetups[nome] }); setOrcamentoUpgrade(500); setModalUpgradeAberto(true); }}>
                    🚀 Upgrade
                  </Button>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button fullWidth variant="contained" color="warning" size="small" sx={{fontWeight:'900', py: 0.2, fontSize: '0.7rem'}} onClick={() => { if (!selecionandoComparar) { setSelecionandoComparar(true); setComparar1(null); setComparar2(null); } handleSelecionarParaComparar(nome); }}>⚖️</Button>
                    <Button fullWidth variant="contained" color="error" size="small" sx={{fontWeight:'900', py: 0.2, fontSize: '0.7rem'}} onClick={() => {setSetupParaApagar(nome); setModalApagarAberto(true);}}>🗑️</Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))
        )}
      </Box>

      {/* ======================================================= */}
      {/* 4. BOTÕES DE NAVEGAÇÃO DE SISTEMA */}
      {/* ======================================================= */}
      <Grid container spacing={1.5}>
        <Grid item xs={6} sm={4} md={2}>
          <Card onClick={() => setRoute('sobre')} sx={{ p: 1, cursor: 'pointer', border: '3px solid', borderColor: 'secondary.main', bgcolor: 'background.paper', transition: '0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '1.8rem', mb: 0.5, lineHeight: 1 }}>ℹ️</Typography>
              <Typography sx={{ fontWeight: '900', color: 'text.primary', fontSize: '0.8rem' }}>SOBRE</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card onClick={() => setRoute('backup')} sx={{ p: 1, cursor: 'pointer', border: '3px solid', borderColor: 'secondary.main', bgcolor: 'background.paper', transition: '0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '1.8rem', mb: 0.5, lineHeight: 1 }}>💾</Typography>
              <Typography sx={{ fontWeight: '900', color: 'text.primary', fontSize: '0.8rem' }}>BACKUP</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
};


export default Home;
