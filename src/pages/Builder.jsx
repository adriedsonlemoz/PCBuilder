import React, { useState } from 'react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import GameHeader from '../components/GameHeader';
import Resumo from '../components/Resumo';
import { categoryKeys, categoryNames } from '../data/pcParts';
import BudgetFilter from '../features/builder/BudgetFilter';
import PartCard from '../features/builder/PartCard';
import ProgressBar from '../features/builder/ProgressBar';
import CustomPartDialog from '../features/builder/dialogs/CustomPartDialog';
import DeletePartDialog from '../features/builder/dialogs/DeletePartDialog';
import EditPartDialog from '../features/builder/dialogs/EditPartDialog';
import SaveSetupDialogs from '../features/builder/dialogs/SaveSetupDialogs';
import TacticalErrorDialog from '../features/builder/dialogs/TacticalErrorDialog';
import { dicasTaticas, multiSelectCategories } from '../features/builder/builderConfig';
import useBuilderFlow from '../features/builder/hooks/useBuilderFlow';
import useBuilderOptions from '../features/builder/hooks/useBuilderOptions';
import usePartManager from '../features/builder/hooks/usePartManager';
import useSetupStorage from '../features/builder/hooks/useSetupStorage';
import { calcularEstrelas } from '../features/builder/builderUtils';

const Builder = ({ setRoute, setupParaEditar }) => {
  const [erroTatico, setErroTatico] = useState({ open: false, titulo: '', msg: '' });

  const mostrarErro = (titulo, msg) => setErroTatico({ open: true, titulo, msg });

  const {
    setup,
    setSetup,
    passoAtual,
    categoriaAtualKey,
    categoriaAtualNome,
    isUltimoPasso,
    isMultiple,
    temPecaSelecionada,
    mostrarResumoFinal,
    setMostrarResumoFinal,
    handleSingleSelect,
    handleAddMulti,
    handleRemoveMulti,
    handleAvancar,
    handleVoltar,
    handleMostrarResumo,
  } = useBuilderFlow({
    setupInicial: setupParaEditar?.dados?.parts || {},
    mostrarErro,
  });

  const aceitaMultiplos = multiSelectCategories;


  const {
    customDialog,
    editDialog,
    deleteDialog,
    handleAbrirModalCustom,
    handleAbrirEdicao,
    handleAbrirExclusao,
  } = usePartManager({
    categoriaAtualKey,
    categoriaAtualNome,
    setup,
    setSetup,
    mostrarErro,
    handleSingleSelect,
    aceitaMultiplos,
  });


  const { openSaveDialog, saveDialogProps } = useSetupStorage({
    setup,
    setupParaEditar,
    setRoute,
    mostrarErro,
  });

  const {
    avisoGargalo,
    categoriaTemPrecos,
    maxPrecoDaCategoria,
    mostrarFiltro,
    opcoes,
    orcamentoMax,
    setMostrarFiltro,
    setOrcamentoMax,
    totalAoVivo,
  } = useBuilderOptions({ categoriaAtualKey, passoAtual, setup });

  if (mostrarResumoFinal) {
    return (
      <Box sx={{ maxWidth: 900, margin: 'auto', pb: 4 }}>
        <Resumo setup={setup} onEdit={() => setMostrarResumoFinal(false)} onSave={openSaveDialog} fnEstrelas={calcularEstrelas} />

        <SaveSetupDialogs {...saveDialogProps} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', height: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 120px)' }, pb: { xs: 4, md: 0 } }}>
      
      <DeletePartDialog {...deleteDialog} />

      <EditPartDialog {...editDialog} />

      <TacticalErrorDialog
        error={erroTatico}
        onClose={() => setErroTatico(prev => ({ ...prev, open: false }))}
      />

      <CustomPartDialog {...customDialog} />

      <Card sx={{ height: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '3px solid', borderColor: 'secondary.main' }}>
        <GameHeader title={`Passo ${passoAtual + 1} / ${categoryKeys.length}: ${categoriaAtualNome}`} />
        
        {/* BARRA DE PROGRESSO VISUAL */}
        <ProgressBar passoAtual={passoAtual} categoryKeys={categoryKeys} categoryNames={categoryNames} setup={setup} aceitaMultiplos={aceitaMultiplos} />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 1, sm: 2 }, '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#a6834d', borderRadius: '4px' } }}>

          {/* AVISO DE GARGALO EM TEMPO REAL */}
          {avisoGargalo && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(148,24,24,0.12)', color: 'error.main', borderRadius: '8px', border: '2px solid', borderColor: 'error.main' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem' }, lineHeight: 1.3 }}>{avisoGargalo.msg}</Typography>
            </Box>
          )}

          {dicasTaticas[categoriaAtualKey] && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: '#118a8b', color: '#fff', borderRadius: '8px', border: '2px solid #0d6e6f', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem' }, lineHeight: 1.3 }}>{dicasTaticas[categoriaAtualKey]}</Typography>
            </Box>
          )}

          {/* FILTRO DE ORÇAMENTO */}
          {categoriaTemPrecos && (
            <BudgetFilter
              orcamentoMax={orcamentoMax}
              setOrcamentoMax={setOrcamentoMax}
              mostrarFiltro={mostrarFiltro}
              setMostrarFiltro={setMostrarFiltro}
              maxPreco={maxPrecoDaCategoria}
            />
          )}

          {opcoes.length === 0 && categoriaAtualKey !== 'socket' ? (
            <Box sx={{ textAlign: 'center', p: 4 }}><Typography sx={{ color: 'error.main', fontWeight: 'bold', fontSize: '1.2rem' }}>⚠️ Nenhuma peça encontrada{orcamentoMax ? ' com este orçamento' : ''}.</Typography></Box>
          ) : (
            <Grid container spacing={1}>
              {categoriaAtualKey !== 'socket' && (
                <Grid item xs={6} sm={4} md={3}>
                  <Box onClick={handleAbrirModalCustom} sx={{ p: 1.5, height: '100%', minHeight: isMultiple ? '110px' : '90px', border: '3px dashed #118a8b', bgcolor: 'rgba(17, 138, 139, 0.05)', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', transition: '0.1s', '&:hover': { bgcolor: 'rgba(17, 138, 139, 0.15)' }, '&:active': { transform: 'scale(0.98)' } }}>
                    <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>➕</Typography>
                    <Typography sx={{ color: 'primary.main', fontWeight: '900', fontSize: { xs: '0.75rem', sm: '0.85rem' }, lineHeight: 1.1 }}>Peça<br/>Manual</Typography>
                  </Box>
                </Grid>
              )}

              {opcoes.map(peca => {
                const quantidade = isMultiple ? (setup[categoriaAtualKey] || []).filter(id => id === peca.id).length : 0;
                const isSelected = isMultiple ? quantidade > 0 : setup[categoriaAtualKey] === peca.id;

                return (
                  <Grid item xs={6} sm={4} md={3} key={peca.id}>
                    <PartCard
                      peca={peca}
                      categoria={categoriaAtualKey}
                      isMultiple={isMultiple}
                      quantidade={quantidade}
                      isSelected={isSelected}
                      onSelect={handleSingleSelect}
                      onAdd={handleAddMulti}
                      onRemove={handleRemoveMulti}
                      onEdit={handleAbrirEdicao}
                      onDelete={handleAbrirExclusao}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        <Box sx={{ bgcolor: '#d6c8a3', p: { xs: 1.5, sm: 2 }, borderTop: '3px solid #a6834d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <Button variant="contained" color="error" onClick={handleVoltar} disabled={passoAtual === 0} sx={{ px: { xs: 1, sm: 3 }, minWidth: { xs: '80px', sm: 'auto' } }}>◀ Voltar</Button>
          <Box sx={{ textAlign: 'center' }}>
             <Typography sx={{ color: 'text.secondary', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Estimado</Typography>
             <Typography sx={{ color: 'success.main', fontWeight: '900', fontSize: { xs: '1.1rem', sm: '1.4rem' }, lineHeight: 1 }}>{totalAoVivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
          </Box>
          {isUltimoPasso ? (
            <Button variant="contained" color="warning" disabled={!temPecaSelecionada} onClick={handleMostrarResumo} sx={{ px: { xs: 1, sm: 3 }, minWidth: { xs: '80px', sm: 'auto' } }}>Resumo 🛒</Button>
          ) : (
            <Button variant="contained" color="info" onClick={handleAvancar} disabled={!temPecaSelecionada} sx={{ px: { xs: 1, sm: 3 }, minWidth: { xs: '80px', sm: 'auto' } }}>Avançar ▶</Button>
          )}
        </Box>
      </Card>
    </Box>
  );
};


export default Builder;
