import { useState } from 'react';
import { dbPcParts } from '../../../data/pcParts';
import { allowedRamMap } from '../builderConfig';

const CUSTOM_PARTS_KEY = 'pcBuilderCustomParts';
const EDITED_PARTS_KEY = 'pcBuilderEditedParts';

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const getCategoryCollection = (category, socket) => {
  if (category === 'mb' || category === 'cpu') {
    if (!dbPcParts[category][socket]) dbPcParts[category][socket] = [];
    return dbPcParts[category][socket];
  }
  return dbPcParts[category] || [];
};

const usePartManager = ({
  categoriaAtualKey,
  categoriaAtualNome,
  setup,
  setSetup,
  mostrarErro,
  handleSingleSelect,
  aceitaMultiplos,
}) => {
  const [modalCustomAberto, setModalCustomAberto] = useState(false);
  const [customNome, setCustomNome] = useState('');
  const [customPreco, setCustomPreco] = useState('');
  const [customSocket, setCustomSocket] = useState('');
  const [customBrand, setCustomBrand] = useState('Intel');
  const [customRamType, setCustomRamType] = useState('DDR4');
  const [customRamCap, setCustomRamCap] = useState('8');

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [editPecaId, setEditPecaId] = useState('');
  const [editPecaNome, setEditPecaNome] = useState('');
  const [editPecaPreco, setEditPecaPreco] = useState('');
  const [editIsCustom, setEditIsCustom] = useState(false);

  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
  const [pecaParaDeletar, setPecaParaDeletar] = useState(null);

  const handleAbrirExclusao = (event, peca) => {
    event.stopPropagation();
    setPecaParaDeletar(peca);
    setModalDeleteAberto(true);
  };

  const executarExclusaoPeca = () => {
    if (!pecaParaDeletar) return;

    const customParts = readJson(CUSTOM_PARTS_KEY, []);
    writeJson(CUSTOM_PARTS_KEY, customParts.filter(item => item.peca.id !== pecaParaDeletar.id));

    const collection = getCategoryCollection(categoriaAtualKey, setup.socket);
    const index = collection.findIndex(item => item.id === pecaParaDeletar.id);
    if (index >= 0) collection.splice(index, 1);

    if (aceitaMultiplos.includes(categoriaAtualKey)) {
      setSetup(prev => ({
        ...prev,
        [categoriaAtualKey]: (prev[categoriaAtualKey] || []).filter(id => id !== pecaParaDeletar.id),
      }));
    } else if (setup[categoriaAtualKey] === pecaParaDeletar.id) {
      handleSingleSelect(null);
    } else {
      setSetup(prev => ({ ...prev }));
    }

    setModalDeleteAberto(false);
    setPecaParaDeletar(null);
  };

  const handleAbrirEdicao = (event, peca) => {
    event.stopPropagation();
    setEditPecaId(peca.id);
    setEditPecaNome(peca.name);
    setEditPecaPreco(peca.price);
    setEditIsCustom(peca.id.startsWith('custom_'));
    setModalEdicaoAberto(true);
  };

  const handleSalvarEdicao = () => {
    if (!editPecaNome.trim() || editPecaPreco === '') {
      mostrarErro('📋 DADOS INCOMPLETOS!', 'Preencha o nome e o preço corretamente.');
      return;
    }

    const precoNum = Number.parseFloat(editPecaPreco);
    if (!Number.isFinite(precoNum) || precoNum < 0) {
      mostrarErro('💰 PREÇO INVÁLIDO!', 'Informe um preço válido, igual ou maior que zero.');
      return;
    }

    const collection = getCategoryCollection(categoriaAtualKey, setup.socket);
    const item = collection.find(peca => peca.id === editPecaId);
    if (item) {
      item.name = editPecaNome.trim();
      item.price = precoNum;
    }

    if (editIsCustom) {
      const customParts = readJson(CUSTOM_PARTS_KEY, []);
      customParts.forEach(saved => {
        if (saved.peca.id === editPecaId) {
          saved.peca.name = editPecaNome.trim();
          saved.peca.price = precoNum;
        }
      });
      writeJson(CUSTOM_PARTS_KEY, customParts);
    } else {
      const editedParts = readJson(EDITED_PARTS_KEY, {});
      editedParts[editPecaId] = { name: editPecaNome.trim(), price: precoNum };
      writeJson(EDITED_PARTS_KEY, editedParts);
    }

    setModalEdicaoAberto(false);
    setSetup(prev => ({ ...prev }));
  };

  const handleAbrirModalCustom = () => {
    setCustomNome('');
    setCustomPreco('');
    setCustomSocket(setup.socket || 'AM4');
    setCustomBrand(setup.socket?.startsWith('LGA') ? 'Intel' : 'AMD');
    setCustomRamCap('8');

    if (categoriaAtualKey === 'ram') {
      const mbEscolhida = (dbPcParts.mb[setup.socket] || []).find(mb => mb.id === setup.mb);
      setCustomRamType(mbEscolhida?.ramType || 'DDR4');
    } else if (setup.socket) {
      setCustomRamType((allowedRamMap[setup.socket] || ['DDR4'])[0]);
    } else {
      setCustomRamType('DDR4');
    }

    setModalCustomAberto(true);
  };

  const handleSalvarCustom = () => {
    if (!customNome.trim() || customPreco === '') {
      mostrarErro('📋 RELATÓRIO EM BRANCO!', 'Preencha o nome e o preço da peça!');
      return;
    }

    const precoNum = Number.parseFloat(customPreco);
    if (!Number.isFinite(precoNum) || precoNum < 0) {
      mostrarErro('💰 PREÇO INVÁLIDO!', 'Informe um preço válido, igual ou maior que zero.');
      return;
    }

    if ((categoriaAtualKey === 'mb' || categoriaAtualKey === 'cpu') && customSocket !== setup.socket) {
      mostrarErro('🛠️ ALERTA DE MARRETA!', `Soquete incompatível. A base é ${setup.socket}!`);
      return;
    }

    if (categoriaAtualKey === 'cpu') {
      const isIntelSocket = customSocket.startsWith('LGA');
      if ((isIntelSocket && customBrand !== 'Intel') || (!isIntelSocket && customBrand !== 'AMD')) {
        mostrarErro('🔥 CHOQUE DE RIVAIS!', `Marca incompatível com o soquete ${customSocket}!`);
        return;
      }
    }

    if (categoriaAtualKey === 'mb' && !(allowedRamMap[customSocket] || []).includes(customRamType)) {
      mostrarErro('⚡ CURTO-CIRCUITO!', `Este soquete não suporta memória ${customRamType}!`);
      return;
    }

    if (categoriaAtualKey === 'ram') {
      const mbEscolhida = (dbPcParts.mb[setup.socket] || []).find(mb => mb.id === setup.mb);
      if (mbEscolhida && customRamType !== mbEscolhida.ramType) {
        mostrarErro('🛑 CORTE FÍSICO!', `A sua placa-mãe suporta apenas ${mbEscolhida.ramType}!`);
        return;
      }
    }

    const nomeFinal = categoriaAtualKey === 'ram'
      ? `${customNome.trim()} ${customRamCap}GB ${customRamType} (Manual)`
      : `${customNome.trim()} (Manual)`;
    const novoId = `custom_${categoriaAtualKey}_${Date.now()}`;
    const novaPeca = { id: novoId, name: nomeFinal, price: precoNum };

    if (categoriaAtualKey === 'mb' || categoriaAtualKey === 'ram') novaPeca.ramType = customRamType;

    getCategoryCollection(categoriaAtualKey, setup.socket).push(novaPeca);

    const customParts = readJson(CUSTOM_PARTS_KEY, []);
    customParts.push({ cat: categoriaAtualKey, socket: setup.socket, peca: novaPeca });
    writeJson(CUSTOM_PARTS_KEY, customParts);

    if (aceitaMultiplos.includes(categoriaAtualKey)) {
      setSetup(prev => ({ ...prev, [categoriaAtualKey]: [...(prev[categoriaAtualKey] || []), novoId] }));
    } else {
      handleSingleSelect(novoId);
    }

    setModalCustomAberto(false);
  };

  return {
    customDialog: {
      open: modalCustomAberto,
      categoriaKey: categoriaAtualKey,
      categoriaNome: categoriaAtualNome,
      sockets: dbPcParts.socket,
      nome: customNome,
      preco: customPreco,
      socket: customSocket,
      brand: customBrand,
      ramType: customRamType,
      ramCap: customRamCap,
      onNomeChange: setCustomNome,
      onPrecoChange: setCustomPreco,
      onSocketChange: setCustomSocket,
      onBrandChange: setCustomBrand,
      onRamTypeChange: setCustomRamType,
      onRamCapChange: setCustomRamCap,
      onClose: () => setModalCustomAberto(false),
      onSave: handleSalvarCustom,
    },
    editDialog: {
      open: modalEdicaoAberto,
      nome: editPecaNome,
      preco: editPecaPreco,
      onNomeChange: setEditPecaNome,
      onPrecoChange: setEditPecaPreco,
      onClose: () => setModalEdicaoAberto(false),
      onSave: handleSalvarEdicao,
    },
    deleteDialog: {
      open: modalDeleteAberto,
      peca: pecaParaDeletar,
      onClose: () => {
        setModalDeleteAberto(false);
        setPecaParaDeletar(null);
      },
      onConfirm: executarExclusaoPeca,
    },
    handleAbrirModalCustom,
    handleAbrirEdicao,
    handleAbrirExclusao,
  };
};

export default usePartManager;
