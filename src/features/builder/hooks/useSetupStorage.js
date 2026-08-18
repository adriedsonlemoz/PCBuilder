import { useState } from 'react';
import { categoryKeys, dbPcParts } from '../../../data/pcParts';
import { calcularTotalAtual } from '../builderUtils';

const SETUPS_KEY = 'pcBuilderSetups';
const MAX_HISTORY = 10;

const readSetups = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETUPS_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeSetups = (setups) => {
  localStorage.setItem(SETUPS_KEY, JSON.stringify(setups));
};

const createVersion = (setup) => {
  const total = calcularTotalAtual(setup, categoryKeys);
  const socketInfo = dbPcParts.socket.find(item => item.id === setup.socket)?.name || 'N/A';

  return {
    parts: setup,
    date: new Date().toLocaleDateString('pt-BR'),
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    total: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    socketInfo,
    history: [],
  };
};

const useSetupStorage = ({ setup, setupParaEditar, setRoute, mostrarErro }) => {
  const [saveOpen, setSaveOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [nomeSetup, setNomeSetup] = useState(setupParaEditar?.nome || '');

  const finishSave = () => {
    setSaveOpen(false);
    setVersionOpen(false);
    setRoute('home');
  };

  const validateName = () => {
    const nomeFinal = nomeSetup.trim();
    if (!nomeFinal) {
      mostrarErro('🛡️ IDENTIFICAÇÃO NECESSÁRIA!', 'Dê um nome ao seu PC antes de guardar.');
      return null;
    }
    return nomeFinal;
  };

  const save = ({ keepHistory = false, overwrite = false } = {}) => {
    const nomeFinal = validateName();
    if (!nomeFinal) return;

    const allSetups = readSetups();
    const existing = allSetups[nomeFinal];

    if (existing && !keepHistory && !overwrite) {
      setVersionOpen(true);
      return;
    }

    const nextVersion = createVersion(setup);

    if (existing && keepHistory) {
      const previousVersion = { ...existing };
      const previousHistory = Array.isArray(previousVersion.history) ? previousVersion.history : [];
      delete previousVersion.history;
      nextVersion.history = [previousVersion, ...previousHistory].slice(0, MAX_HISTORY);
    }

    allSetups[nomeFinal] = nextVersion;
    writeSetups(allSetups);
    finishSave();
  };

  return {
    openSaveDialog: () => setSaveOpen(true),
    saveDialogProps: {
      saveOpen,
      versionOpen,
      nomeSetup,
      onNomeChange: setNomeSetup,
      onSaveClose: () => setSaveOpen(false),
      onVersionClose: () => setVersionOpen(false),
      onSave: () => save(),
      onSaveVersion: () => save({ keepHistory: true }),
      onOverwrite: () => save({ overwrite: true }),
    },
  };
};

export default useSetupStorage;
