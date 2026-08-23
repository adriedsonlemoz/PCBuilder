import { partsStorage, setupStorage } from './storage.js';

export const BACKUP_VERSION = 2;

const encodeUtf8Base64 = (value) => btoa(encodeURIComponent(value));
const decodeUtf8Base64 = (value) => decodeURIComponent(atob(value));

export const createBackupPayload = () => ({
  backupVersion: BACKUP_VERSION,
  app: 'Meu PC',
  createdAt: new Date().toISOString(),
  setups: setupStorage.read(),
  customParts: partsStorage.readCustom(),
  editedParts: partsStorage.readEdited(),
});

export const encodeBackup = (payload = createBackupPayload()) => encodeUtf8Base64(JSON.stringify(payload));

export const normalizeBackup = (raw) => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Formato de backup inválido.');
  // Compatibilidade v1: { setups, custom }
  if (!raw.backupVersion) {
    return { backupVersion: 1, setups: raw.setups || {}, customParts: raw.custom || [], editedParts: raw.edited || {} };
  }
  return {
    backupVersion: raw.backupVersion,
    setups: raw.setups || {},
    customParts: raw.customParts || raw.custom || [],
    editedParts: raw.editedParts || raw.edited || {},
  };
};

export const decodeBackup = (code) => normalizeBackup(JSON.parse(decodeUtf8Base64(code.trim())));

export const restoreBackup = (backup) => {
  const data = normalizeBackup(backup);
  if (!data.setups || typeof data.setups !== 'object' || Array.isArray(data.setups)) throw new Error('Setups inválidos.');
  if (!Array.isArray(data.customParts)) throw new Error('Peças manuais inválidas.');
  if (!data.editedParts || typeof data.editedParts !== 'object' || Array.isArray(data.editedParts)) throw new Error('Edições inválidas.');
  setupStorage.write(data.setups);
  partsStorage.writeCustom(data.customParts);
  partsStorage.writeEdited(data.editedParts);
  return data;
};
