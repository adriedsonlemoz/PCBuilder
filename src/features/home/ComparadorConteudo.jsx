import React from 'react';
import { Box, Button, DialogActions, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import GameHeader from '../../components/GameHeader';
import { categoryKeys, categoryNames } from '../../data/pcParts';
import { selectionName, selectionPrice } from '../../domain/parts';

const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const ComparadorConteudo = ({ comparar1, comparar2, calcularTotalSetup, fechar }) => {
  const total1 = calcularTotalSetup(comparar1);
  const total2 = calcularTotalSetup(comparar2);
  const diffTotal = total1 - total2;

  const getPreco = (s, cat) => selectionPrice(cat, s.parts?.[cat], s.parts?.socket);

  const getNome = (s, cat) => selectionName(cat, s.parts?.[cat], s.parts?.socket);

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


export default ComparadorConteudo;
