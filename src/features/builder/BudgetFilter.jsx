import React from 'react';
import { Box, Button, Slider, Typography } from '@mui/material';

export default function BudgetFilter({ orcamentoMax, setOrcamentoMax, mostrarFiltro, setMostrarFiltro, maxPreco }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontWeight: '900', fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase' }}>
          🎯 Filtro de Orçamento
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {orcamentoMax && (
            <Typography sx={{ fontWeight: '900', fontSize: '0.85rem', color: 'success.main' }}>
              até {orcamentoMax.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
          )}
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setMostrarFiltro(value => !value);
              if (mostrarFiltro) setOrcamentoMax(null);
            }}
            sx={{ fontSize: '0.7rem', py: 0.2, px: 1, minWidth: 0, border: '1px solid', borderColor: 'secondary.main', color: 'text.secondary' }}
          >
            {mostrarFiltro ? 'Limpar' : 'Filtrar'}
          </Button>
        </Box>
      </Box>
      {mostrarFiltro && (
        <Box sx={{ px: 1 }}>
          <Slider
            value={orcamentoMax || maxPreco}
            min={0}
            max={maxPreco}
            step={50}
            onChange={(_, value) => setOrcamentoMax(value)}
            sx={{ color: 'primary.main' }}
          />
        </Box>
      )}
    </Box>
  );
}
