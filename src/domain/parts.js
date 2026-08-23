import { categoryKeys, dbPcParts } from '../data/pcParts.js';

export const getPartList = (category, socket) => {
  if (!dbPcParts[category]) return [];
  if (category === 'mb' || category === 'cpu') return dbPcParts[category][socket] || [];
  return dbPcParts[category] || [];
};

export const findPart = (category, id, socket) => getPartList(category, socket).find(part => part.id === id) || null;

export const getSelectionIds = (selection) => selection == null ? [] : (Array.isArray(selection) ? selection : [selection]);

export const selectionPrice = (category, selection, socket) => getSelectionIds(selection)
  .reduce((sum, id) => sum + (findPart(category, id, socket)?.price || 0), 0);

export const selectionName = (category, selection, socket) => {
  const ids = getSelectionIds(selection);
  if (!ids.length) return '-';
  const counts = ids.reduce((acc, id) => ({ ...acc, [id]: (acc[id] || 0) + 1 }), {});
  return Object.entries(counts).map(([id, count]) => {
    const part = findPart(category, id, socket);
    return part ? `${count > 1 ? `${count}x ` : ''}${part.name}` : id;
  }).join(' + ');
};

export const calculateSetupTotal = (setupOrSaved) => {
  const setup = setupOrSaved?.parts || setupOrSaved || {};
  return categoryKeys.reduce((sum, category) => {
    if (category === 'socket') return sum;
    return sum + selectionPrice(category, setup[category], setup.socket);
  }, 0);
};

export const getPrimaryPart = (setupOrSaved, category) => {
  const setup = setupOrSaved?.parts || setupOrSaved || {};
  const [id] = getSelectionIds(setup[category]);
  return id ? findPart(category, id, setup.socket) : null;
};
