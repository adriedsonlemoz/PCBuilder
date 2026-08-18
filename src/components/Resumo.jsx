import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, AppBar, Box, Button, Card, Chip, Collapse, Container, CssBaseline,
  Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, Grid,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Slider,
  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField,
  ThemeProvider, Toolbar, Tooltip, Typography, createTheme
} from '@mui/material';
import { categoryKeys, categoryNames, dbPcParts } from '../data/pcParts';

// ===== Resumo.js =====
const Resumo = ({ setup, onEdit, onSave, fnEstrelas }) => {
  const [toastAberto, setToastAberto] = useState(false);
  
  const avaliarDesempenho = (itens) => {
    const cpu = itens.find(i => i.catId === 'cpu');
    const gpus = itens.filter(i => i.catId === 'gpu'); 
    const rams = itens.filter(i => i.catId === 'ram'); 

    if (!cpu || gpus.length === 0 || rams.length === 0) {
      return { title: "⚙️ Análise Pendente", desc: "Aguardando peças", color: "#6e5436", bg: "rgba(110, 84, 54, 0.1)" };
    }

    let ramSize = 0;
    rams.forEach(ram => {
      let size = 8;
      let match = ram.nomePeca.match(/(\d+)GB/i);
      if(match) size = parseInt(match[1]);
      let hasQty = ram.nomePeca.match(/(\d+)x/i);
      if(hasQty) size = size * parseInt(hasQty[1]);
      ramSize += size;
    });

    let gpuPrice = Math.max(...gpus.map(g => g.precoUnitario));
    let isIntegrated = gpus.some(g => g.id === 'gpu_int' || g.nomePeca.toLowerCase().includes('integrado'));

    if (isIntegrated) {
      if (ramSize >= 16) return { title: "🛶 Barco de Pesca", desc: "Guerreiro! Segura as pontas no trabalho e e-sports leves.", color: "#1565c0", bg: "rgba(21, 101, 192, 0.1)" };
      return { title: "🪵 Tronco de Árvore", desc: "Mal flutua. O Windows vai engasgar com tão pouca RAM.", color: "#b45309", bg: "rgba(180, 83, 9, 0.1)" };
    } else {
      if (gpuPrice < 1500) {
        if (ramSize < 16) return { title: "⛵ Veleiro com Furo", desc: "A placa tem força, mas a falta de RAM vai afundar o PC nos jogos.", color: "#b45309", bg: "rgba(180, 83, 9, 0.1)" };
        return { title: "🚤 Lancha Rápida", desc: "Excelente Custo-Benefício! Corta as ondas do Full HD com estilo.", color: "#15803d", bg: "rgba(21, 128, 61, 0.1)" };
      } else if (gpuPrice < 3500) {
        if (ramSize < 16) return { title: "🚢 Submarino sem Radar", desc: "Potente, mas a RAM é insuficiente para guiar a placa de vídeo.", color: "#941818", bg: "rgba(148, 24, 24, 0.1)" };
        return { title: "🚀 Foguete Espacial", desc: "Rumo à lua! Roda jogos atuais no Alto/Ultra em Quad HD.", color: "#7c3aed", bg: "rgba(124, 58, 237, 0.1)" };
      } else {
        if (ramSize < 32) return { title: "🛸 Óvni Sem Combustível", desc: "Tecnologia alienígena sendo freada por não ter 32GB de RAM!", color: "#b45309", bg: "rgba(180, 83, 9, 0.1)" };
        return { title: "🌌 Estrela da Morte", desc: "Poder de destruição planetária em 4K. Não há limites!", color: "#be123c", bg: "rgba(190, 18, 60, 0.1)" };
      }
    }
  };

  const { total, itensAgrupados, desempenho } = useMemo(() => {
    let sum = 0;
    let listaCrua = [];

    categoryKeys.forEach(cat => {
      const selection = setup[cat];
      if (!selection) return;

      let listaPecas = (cat === 'mb' || cat === 'cpu') ? (dbPcParts[cat][setup.socket] || []) : (dbPcParts[cat] || []);
      const ids = Array.isArray(selection) ? selection : [selection];
      
      ids.forEach(id => {
        const peca = listaPecas.find(p => p.id === id);
        if (peca) {
          sum += peca.price;
          const partesCat = categoryNames[cat].split(' ');
          partesCat.shift();
          const catLimpa = partesCat.join(' ');
          
          const estrelas = fnEstrelas ? fnEstrelas(cat, peca.name, peca.price) : "";

          listaCrua.push({ catId: cat, id: peca.id, nomeCategoria: catLimpa, nomePeca: peca.name, precoUnitario: peca.price, estrelas: estrelas });
        }
      });
    });

    const agrupados = [];
    listaCrua.forEach(item => {
      const existente = agrupados.find(a => a.id === item.id && a.catId === item.catId);
      if (existente) {
        existente.qtd += 1;
        existente.precoTotal += item.precoUnitario;
      } else {
        agrupados.push({ ...item, qtd: 1, precoTotal: item.precoUnitario });
      }
    });

    return { total: sum, itensAgrupados: agrupados, desempenho: avaliarDesempenho(listaCrua) };
  }, [setup, fnEstrelas]);

  const handleCopiar = () => {
    if (itensAgrupados.length === 0) return;
    let texto = `🖥️ Benchmark da Máquina: ${desempenho.title}\n\n`;
    
    itensAgrupados.forEach(item => {
      const prefixoQtd = item.qtd > 1 ? `${item.qtd}x ` : "";
      texto += `• ${item.nomeCategoria.toUpperCase()}: ${prefixoQtd}${item.nomePeca} ${item.estrelas}\n`;
    });
    
    texto += `\n💰 CUSTO: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    texto += `⚙️ DIAGNÓSTICO: ${desempenho.desc}`;

    navigator.clipboard.writeText(texto)
      .then(() => setToastAberto(true))
      .catch(() => alert("Erro ao copiar."));
  };

  return (
    <Box>
      <Card sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#ebdcb8', border: '3px solid #a6834d', borderRadius: '8px', mb: 2 }}>
        
        <Snackbar open={toastAberto} autoHideDuration={3000} onClose={() => setToastAberto(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setToastAberto(false)} severity="success" variant="filled" sx={{ fontWeight: 'bold', mt: 7 }}>Orçamento e Classificação copiados!</Alert>
        </Snackbar>

        <Box sx={{ bgcolor: 'primary.main', borderBottom: '3px solid #a6834d', p: 2, textAlign: 'center' }}>
          <Typography sx={{ color: 'primary.contrastText', fontWeight: '900', fontSize: '1.4rem', textShadow: '1px 2px 2px rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>
            📋 Relatório de Benchmark
          </Typography>
        </Box>
        
        <Box sx={{ p: 2, bgcolor: desempenho.bg, borderBottom: '2px solid #a6834d', textAlign: 'center' }}>
          <Typography sx={{ color: desempenho.color, fontWeight: '900', fontSize: '1.4rem', mb: 0.5 }}>{desempenho.title}</Typography>
          <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.9rem' }}>{desempenho.desc}</Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          {itensAgrupados.map((item, idx) => (
            <Box key={idx} sx={{ mb: 2, pb: 1.5, borderBottom: '1px dashed #a6834d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ color: 'secondary.main', fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase' }}>{item.nomeCategoria}</Typography>
                <Typography sx={{ color: 'text.primary', fontSize: '1.05rem', fontWeight: '900', lineHeight: 1.2, my: 0.5 }}>
                  {item.qtd > 1 && <span style={{ color: '#d32f2f', marginRight: '5px' }}>{item.qtd}x</span>}{item.nomePeca}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', letterSpacing: '2px' }}>{item.estrelas}</Typography>
              </Box>
              <Typography sx={{ color: 'success.main', fontSize: '1.1rem', fontWeight: '900', whiteSpace: 'nowrap' }}>
                {item.precoTotal === 0 ? 'Grátis' : item.precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
            </Box>
          ))}

          <Box sx={{ mt: 3, pt: 3, borderTop: '4px solid #a6834d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Typography sx={{ color: 'text.secondary', fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase' }}>Custo Total:</Typography>
             <Typography sx={{ color: 'primary.main', fontSize: '2.2rem', fontWeight: '900', lineHeight: 1 }}>
               {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
             </Typography>
          </Box>
        </Box>
      </Card>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <Button fullWidth variant="contained" color="error" onClick={onEdit} sx={{ fontWeight: '900', py: { xs: 1, sm: 1.5 }, px: 0, fontSize: { xs: '0.8rem', sm: '1rem' } }}>◀ Editar</Button>
        <Button fullWidth variant="contained" color="info" disabled={itensAgrupados.length === 0} onClick={handleCopiar} sx={{ fontWeight: '900', py: { xs: 1, sm: 1.5 }, px: 0, fontSize: { xs: '0.8rem', sm: '1rem' } }}>📤 Copiar</Button>
        <Button fullWidth variant="contained" color="success" onClick={onSave} sx={{ fontWeight: '900', py: { xs: 1, sm: 1.5 }, px: 0, fontSize: { xs: '0.8rem', sm: '1rem' } }}>💾 Salvar</Button>
      </Box>
    </Box>
  );
};


export default Resumo;
