export const STORAGE_KEYS = Object.freeze({
  setups: 'pcBuilderSetups',
  customParts: 'pcBuilderCustomParts',
  editedParts: 'pcBuilderEditedParts',
  errorLog: 'pcBuilder_ErrorLog',
});

const getStorage = () => (typeof globalThis !== 'undefined' && globalThis.localStorage ? globalThis.localStorage : null);

export const readJson = (key, fallback) => {
  try {
    const storage = getStorage();
    if (!storage) return fallback;
    const raw = storage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  const storage = getStorage();
  if (!storage) return false;
  try { storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
};

export const removeStored = (key) => {
  const storage = getStorage();
  if (!storage) return false;
  try { storage.removeItem(key); return true; } catch { return false; }
};

export const setupStorage = {
  read: () => {
    const value = readJson(STORAGE_KEYS.setups, {});
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  },
  write: (value) => writeJson(STORAGE_KEYS.setups, value),
};

export const partsStorage = {
  readCustom: () => {
    const value = readJson(STORAGE_KEYS.customParts, []);
    return Array.isArray(value) ? value : [];
  },
  writeCustom: (value) => writeJson(STORAGE_KEYS.customParts, value),
  readEdited: () => {
    const value = readJson(STORAGE_KEYS.editedParts, {});
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  },
  writeEdited: (value) => writeJson(STORAGE_KEYS.editedParts, value),
};

export const errorStorage = {
  read: () => {
    const value = readJson(STORAGE_KEYS.errorLog, []);
    return Array.isArray(value) ? value : [];
  },
  write: (value) => writeJson(STORAGE_KEYS.errorLog, value),
  clear: () => removeStored(STORAGE_KEYS.errorLog),
};

export const clearAllUserData = () => Object.values(STORAGE_KEYS).forEach(removeStored);
