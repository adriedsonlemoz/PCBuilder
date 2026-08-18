import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { calcularEstrelas } from './builderUtils';

export default function PartCard({
  peca,
  categoria,
  isMultiple,
  quantidade,
  isSelected,
  onSelect,
  onAdd,
  onRemove,
  onEdit,
  onDelete,
}) {
  const estrelas = calcularEstrelas(categoria, peca.name, peca.price);
  const isCustom = peca.id.startsWith('custom_');

  return (
    <Box
      onClick={() => !isMultiple && onSelect(peca.id)}
      sx={{
        position: 'relative', p: 1.5, height: '100%', minHeight: isMultiple ? '110px' : '90px',
        border: isSelected ? '3px solid' : '2px solid', borderColor: isSelected ? 'primary.main' : '#a6834d',
        bgcolor: isSelected ? '#e4f0f0' : '#d6c8a3', boxShadow: isSelected ? '0 4px 12px rgba(17, 138, 139, 0.3)' : 'none',
        borderRadius: '8px', cursor: isMultiple ? 'default' : 'pointer', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center', transition: 'all 0.2s ease',
        transform: isSelected && !isMultiple ? 'translateY(-3px)' : 'none', '&:active': { transform: 'scale(0.98)' }
      }}
    >
      {categoria !== 'socket' && (
        <Box sx={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 0.5, zIndex: 5 }}>
          <Box onClick={(e) => onEdit(e, peca)} sx={{ bgcolor: 'rgba(255,255,255,0.6)', borderRadius: '4px', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.3)', cursor: 'pointer', transition: '0.1s', '&:hover': { bgcolor: '#fff', transform: 'scale(1.1)' } }}>
            <Typography sx={{ fontSize: '0.7rem' }}>✏️</Typography>
          </Box>
          {isCustom && (
            <Box onClick={(e) => onDelete(e, peca)} sx={{ bgcolor: 'rgba(244, 67, 54, 0.2)', borderRadius: '4px', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.3)', cursor: 'pointer', transition: '0.1s', '&:hover': { bgcolor: '#f44336', transform: 'scale(1.1)' } }}>
              <Typography sx={{ fontSize: '0.7rem' }}>🗑️</Typography>
            </Box>
          )}
        </Box>
      )}

      {categoria !== 'socket' && (
        <Box sx={{ bgcolor: '#362414', px: 1, py: 0.3, borderRadius: '12px', mb: 1, mt: 1.5, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}>
          <Typography sx={{ fontSize: '0.6rem', letterSpacing: '2px', lineHeight: 1 }}>{estrelas}</Typography>
        </Box>
      )}

      <Typography sx={{ color: 'text.primary', fontWeight: '900', fontSize: { xs: '0.75rem', sm: '0.85rem' }, mb: 0.5, lineHeight: 1.1, mt: categoria === 'socket' ? 0 : 'auto' }}>
        {peca.name}
      </Typography>
      <Typography sx={{ color: 'success.main', fontWeight: '900', fontSize: { xs: '0.9rem', sm: '1.05rem' } }}>
        {peca.price === 0 ? 'Grátis' : `R$ ${peca.price.toFixed(2)}`}
      </Typography>

      {isMultiple && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 'auto', pt: 1 }}>
          <Button size="small" variant="contained" color="error" sx={{ minWidth: '30px', height: '30px', p: 0, fontSize: '1.1rem', boxShadow: 'none' }} onClick={(e) => onRemove(e, peca.id)} disabled={quantidade === 0}>-</Button>
          <Typography sx={{ fontWeight: '900', color: isSelected ? '#fff' : 'text.primary', bgcolor: isSelected ? 'primary.main' : 'rgba(0,0,0,0.1)', px: 1.5, py: 0.3, borderRadius: '4px', fontSize: '0.9rem' }}>{quantidade}</Typography>
          <Button size="small" variant="contained" color="success" sx={{ minWidth: '30px', height: '30px', p: 0, fontSize: '1.1rem', boxShadow: 'none' }} onClick={(e) => onAdd(e, peca.id)}>+</Button>
        </Box>
      )}
    </Box>
  );
}
