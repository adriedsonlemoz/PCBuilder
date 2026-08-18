import {
  caseFormFactorMap,
  caseSupports,
  cpuTdpMap,
  dbPcParts,
  gpuTdpMap,
  mbFormFactorMap,
  psuWattMap,
} from '../../data/pcParts';

export const calcularEstrelas = (cat, nome, preco) => {
  let n = 1;
  const nomeLower = (nome || '').toLowerCase();

  if (cat === 'gpu') {
    if (nomeLower.includes('integrado')) n = 1;
    else if (preco < 700) n = 2;
    else if (preco < 1300) n = 3;
    else if (preco < 2000) n = 4;
    else n = 5;
  } else if (cat === 'cpu') {
    if (preco < 400) n = 1;
    else if (preco < 700) n = 2;
    else if (preco < 1000) n = 3;
    else if (preco < 1500) n = 4;
    else n = 5;
  } else if (cat === 'storage') {
    if (nomeLower.includes('hdd') || nomeLower.includes('sata')) n = 1;
    else if (nomeLower.includes('gen3')) n = 3;
    else if (nomeLower.includes('gen4')) n = 4;
    else if (nomeLower.includes('gen5')) n = 5;
    else n = 2;
  } else if (cat === 'ram') {
    if (nomeLower.includes('ddr3')) n = 1;
    else if (nomeLower.includes('ddr4') && preco < 300) n = 2;
    else if (nomeLower.includes('ddr4')) n = 3;
    else if (nomeLower.includes('ddr5') && preco < 1000) n = 4;
    else n = 5;
  } else {
    if (preco < 100) n = 1;
    else if (preco < 250) n = 2;
    else if (preco < 500) n = 3;
    else if (preco < 1000) n = 4;
    else n = 5;
  }

  return '⭐'.repeat(n);
};

export const getOpcoesCompativeis = (categoria, setup) => {
  if (categoria === 'mb' || categoria === 'cpu') {
    return setup.socket ? (dbPcParts[categoria][setup.socket] || []) : [];
  }

  if (categoria === 'ram' && setup.mb) {
    const mbEscolhida = (dbPcParts.mb[setup.socket] || []).find(m => m.id === setup.mb);
    if (mbEscolhida) return dbPcParts.ram.filter(r => r.ramType === mbEscolhida.ramType);
  }

  return dbPcParts[categoria] || [];
};

export const calcularTotalAtual = (setup, categoryKeys) => {
  let sum = 0;

  categoryKeys.forEach(cat => {
    const selection = setup[cat];
    if (!selection) return;

    const listaPecas = (cat === 'mb' || cat === 'cpu')
      ? (dbPcParts[cat][setup.socket] || [])
      : (dbPcParts[cat] || []);

    const ids = Array.isArray(selection) ? selection : [selection];
    ids.forEach(id => {
      const peca = listaPecas.find(p => p.id === id);
      if (peca) sum += peca.price;
    });
  });

  return sum;
};

export const calcularAvisoGargalo = (setup) => {
  if (!setup.cpu || !setup.gpu) return null;

  const gpuIds = Array.isArray(setup.gpu) ? setup.gpu : [setup.gpu];
  if (gpuIds.includes('gpu_int')) return null;

  const gpuList = dbPcParts.gpu || [];
  const gpuMaxPrice = Math.max(...gpuIds.map(id => (gpuList.find(g => g.id === id) || {}).price || 0));
  const cpuList = dbPcParts.cpu[setup.socket] || [];
  const cpuPrice = (cpuList.find(c => c.id === setup.cpu) || {}).price || 0;

  if (gpuMaxPrice <= 0 || cpuPrice <= 0) return null;

  const ratio = gpuMaxPrice / cpuPrice;
  if (ratio > 5) {
    return { tipo: 'cpu', msg: '⚠️ Gargalo Potencial: CPU muito fraca para esta GPU. O processador pode limitar o desempenho nos jogos.' };
  }
  if (ratio < 0.5) {
    return { tipo: 'gpu', msg: '⚠️ Gargalo Potencial: GPU muito fraca para esta CPU. A placa de vídeo vai ser o ponto fraco.' };
  }
  return null;
};

export const validarFonte = (setup) => {
  if (!setup.psu || !setup.cpu || !setup.gpu) return null;

  const gpuIds = Array.isArray(setup.gpu) ? setup.gpu : [setup.gpu];
  const gpuTdp = Math.max(...gpuIds.map(id => gpuTdpMap[id] || 0));
  const cpuTdp = cpuTdpMap[setup.cpu] || 65;
  const tdpTotal = cpuTdp + gpuTdp + 60;
  const psuW = psuWattMap[setup.psu] || 0;

  if (psuW > 0 && psuW < tdpTotal * 1.2) {
    return {
      titulo: '🔋 FONTE INSUFICIENTE!',
      msg: `Consumo estimado: ~${tdpTotal}W. A sua fonte de ${psuW}W pode não ter margem de segurança (recomendado 20% acima). Escolha uma fonte mais potente.`,
    };
  }
  return null;
};

export const validarGabinete = (setup) => {
  if (!setup.case || setup.case === 'case_none' || !setup.mb) return null;
  if (caseSupports(setup.case, setup.mb)) return null;

  const mf = mbFormFactorMap[setup.mb] || 'ATX';
  const cf = caseFormFactorMap[setup.case] || 'ATX';
  return {
    titulo: '📦 GABINETE INCOMPATÍVEL!',
    msg: `A sua Placa-Mãe é ${mf} mas o gabinete selecionado suporta apenas ${cf}. Escolha um gabinete maior ou uma placa menor.`,
  };
};
