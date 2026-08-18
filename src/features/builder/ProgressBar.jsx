import React from 'react';
import { Box, Tooltip } from '@mui/material';

const icons = {
  socket:'⚙️', mb:'🖲️', cpu:'🧠', ram:'⚡', storage:'💾', gpu:'🎮', case:'📦',
  psu:'🔋', monitor:'🖥️', keyboard:'⌨️', mouse:'🖱️', mousepad:'🔲', audio:'🔊'
};

export default function ProgressBar({ passoAtual, categoryKeys, categoryNames, setup, aceitaMultiplos }) {
  return (
    <Box sx={{ px: { xs: 0.5, sm: 2 }, py: 1, bgcolor: 'background.paper', borderBottom: '2px solid', borderColor: 'secondary.main', overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', mx: 'auto', width: 'fit-content' }}>
        {categoryKeys.map((key, idx) => {
          const sel = setup[key];
          const done = aceitaMultiplos.includes(key) ? (sel && sel.length > 0) : !!sel;
          const isCurrent = idx === passoAtual;
          const isPast = idx < passoAtual;

          return (
            <React.Fragment key={key}>
              <Tooltip title={categoryNames[key]} placement="top">
                <Box sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default',
                  opacity: isCurrent ? 1 : isPast ? 0.85 : 0.4, transition: '0.2s',
                }}>
                  <Box sx={{
                    width: { xs: 28, sm: 34 }, height: { xs: 28, sm: 34 }, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: isCurrent ? 'primary.main' : done ? 'success.main' : 'background.default',
                    border: '2px solid', borderColor: isCurrent ? 'primary.main' : done ? 'success.main' : 'secondary.main',
                    fontSize: { xs: '0.8rem', sm: '1rem' }, boxShadow: isCurrent ? '0 0 8px rgba(17,138,139,0.6)' : 'none',
                  }}>
                    {done && !isCurrent ? '✔' : icons[key]}
                  </Box>
                </Box>
              </Tooltip>
              {idx < categoryKeys.length - 1 && (
                <Box sx={{ width: { xs: 8, sm: 14 }, height: '2px', bgcolor: idx < passoAtual ? 'success.main' : 'secondary.main', opacity: 0.5, mx: 0.3 }} />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
