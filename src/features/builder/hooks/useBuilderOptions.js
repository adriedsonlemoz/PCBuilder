import { useEffect, useMemo, useState } from 'react';
import { categoryKeys } from '../../../data/pcParts';
import {
  calcularAvisoGargalo,
  calcularTotalAtual,
  getOpcoesCompativeis,
} from '../builderUtils';

const arredondarPrecoMaximo = (opcoes) => {
  if (!opcoes.length) return 10000;
  const maiorPreco = Math.max(...opcoes.map(peca => Number(peca.price) || 0));
  return maiorPreco > 0 ? Math.ceil(maiorPreco / 100) * 100 : 10000;
};

const useBuilderOptions = ({ categoriaAtualKey, passoAtual, setup }) => {
  const [orcamentoMax, setOrcamentoMax] = useState(null);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  useEffect(() => {
    setOrcamentoMax(null);
    setMostrarFiltro(false);
  }, [passoAtual]);

  const todasOpcoes = useMemo(
    () => getOpcoesCompativeis(categoriaAtualKey, setup),
    [categoriaAtualKey, setup]
  );

  const opcoes = useMemo(() => {
    if (!orcamentoMax) return todasOpcoes;
    return todasOpcoes.filter(peca => peca.price === 0 || peca.price <= orcamentoMax);
  }, [orcamentoMax, todasOpcoes]);

  const maxPrecoDaCategoria = useMemo(
    () => arredondarPrecoMaximo(todasOpcoes),
    [todasOpcoes]
  );

  const avisoGargalo = useMemo(
    () => calcularAvisoGargalo(setup),
    [setup.cpu, setup.gpu, setup.socket]
  );

  const totalAoVivo = useMemo(
    () => calcularTotalAtual(setup, categoryKeys),
    [setup]
  );

  const categoriaTemPrecos = useMemo(
    () => categoriaAtualKey !== 'socket' && todasOpcoes.some(peca => peca.price > 0),
    [categoriaAtualKey, todasOpcoes]
  );

  return {
    avisoGargalo,
    categoriaTemPrecos,
    maxPrecoDaCategoria,
    mostrarFiltro,
    opcoes,
    orcamentoMax,
    setMostrarFiltro,
    setOrcamentoMax,
    todasOpcoes,
    totalAoVivo,
  };
};

export default useBuilderOptions;
