import { useMemo, useState } from 'react';
import { categoryKeys, categoryNames } from '../../../data/pcParts';
import { multiSelectCategories } from '../builderConfig';
import { validarCompatibilidadeCompleta } from '../builderUtils';

const normalizarSetup = (parts = {}) => {
  const setup = { ...parts };

  multiSelectCategories.forEach((categoria) => {
    if (setup[categoria] && !Array.isArray(setup[categoria])) {
      setup[categoria] = [setup[categoria]];
    }
    if (!setup[categoria]) {
      setup[categoria] = [];
    }
  });

  return setup;
};

const useBuilderFlow = ({ setupInicial, mostrarErro }) => {
  const [setup, setSetup] = useState(() => normalizarSetup(setupInicial));
  const [passoAtual, setPassoAtual] = useState(0);
  const [mostrarResumoFinal, setMostrarResumoFinal] = useState(false);

  const categoriaAtualKey = categoryKeys[passoAtual];
  const categoriaAtualNome = categoryNames[categoriaAtualKey];
  const isUltimoPasso = passoAtual === categoryKeys.length - 1;
  const isMultiple = multiSelectCategories.includes(categoriaAtualKey);

  const temPecaSelecionada = useMemo(() => {
    const valor = setup[categoriaAtualKey];
    return isMultiple ? Array.isArray(valor) && valor.length > 0 : Boolean(valor);
  }, [categoriaAtualKey, isMultiple, setup]);

  const handleSingleSelect = (itemId) => {
    setSetup((prev) => {
      const novoSetup = { ...prev, [categoriaAtualKey]: itemId };

      if (categoriaAtualKey === 'socket') {
        novoSetup.mb = null;
        novoSetup.cpu = null;
        novoSetup.ram = [];
      }

      if (categoriaAtualKey === 'mb') {
        novoSetup.ram = [];
      }

      return novoSetup;
    });
  };

  const handleAddMulti = (event, itemId) => {
    event?.stopPropagation?.();

    if (itemId === 'gpu_int') {
      const selecionados = setup[categoriaAtualKey] || [];
      if (selecionados.includes('gpu_int')) {
        mostrarErro(
          '🧠 ALUCINAÇÃO TÁTICA!',
          'O processador só tem espaço para UM chip gráfico integrado!',
        );
        return;
      }
    }

    setSetup((prev) => ({
      ...prev,
      [categoriaAtualKey]: [...(prev[categoriaAtualKey] || []), itemId],
    }));
  };

  const handleRemoveMulti = (event, itemId) => {
    event?.stopPropagation?.();

    setSetup((prev) => {
      const lista = prev[categoriaAtualKey] || [];
      const index = lista.indexOf(itemId);
      if (index < 0) return prev;

      const novaLista = [...lista];
      novaLista.splice(index, 1);
      return { ...prev, [categoriaAtualKey]: novaLista };
    });
  };

  const handleAvancar = () => {
    if (!isUltimoPasso) {
      setPassoAtual((prev) => prev + 1);
    }
  };

  const handleVoltar = () => {
    if (passoAtual > 0) {
      setPassoAtual((prev) => prev - 1);
    }
  };

  const handleMostrarResumo = () => {
    if (!setup.socket) {
      mostrarErro('⚙️ PLATAFORMA AUSENTE!', 'Selecione um socket antes de ver o resumo.');
      return;
    }
    if (!setup.mb) {
      mostrarErro('🖲️ PLACA-MÃE AUSENTE!', 'Selecione uma Placa-Mãe antes de ver o resumo.');
      return;
    }
    if (!setup.cpu) {
      mostrarErro('🧠 PROCESSADOR AUSENTE!', 'Selecione um Processador antes de ver o resumo.');
      return;
    }
    if (!Array.isArray(setup.ram) || setup.ram.length === 0) {
      mostrarErro('⚡ RAM AUSENTE!', 'Selecione pelo menos um pente de RAM antes de ver o resumo.');
      return;
    }

    const erroCompatibilidade = validarCompatibilidadeCompleta(setup);
    if (erroCompatibilidade) {
      mostrarErro(erroCompatibilidade.titulo, erroCompatibilidade.msg);
      return;
    }

    setMostrarResumoFinal(true);
  };

  return {
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
  };
};

export default useBuilderFlow;
