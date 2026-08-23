import {
  caseFormFactorMap,
  caseSupports,
  cpuTdpMap,
  dbPcParts,
  gpuTdpMap,
  mbFormFactorMap,
  psuWattMap,
} from '../../data/pcParts.js';
import { calculateSetupTotal, findPart, getPartList, getSelectionIds } from '../../domain/parts.js';
import { estimateBalance } from '../home/upgradeUtils.js';

export const calcularEstrelas = (cat, nome, preco) => {
  let n = 1;
  const nomeLower = (nome || '').toLowerCase();
  if (cat === 'gpu') {
    if (nomeLower.includes('integrado')) n = 1;
    else if (preco < 700) n = 2; else if (preco < 1300) n = 3; else if (preco < 2000) n = 4; else n = 5;
  } else if (cat === 'cpu') {
    if (preco < 400) n = 1; else if (preco < 700) n = 2; else if (preco < 1000) n = 3; else if (preco < 1500) n = 4; else n = 5;
  } else if (cat === 'storage') {
    if (nomeLower.includes('hdd') || nomeLower.includes('sata')) n = 1; else if (nomeLower.includes('gen3')) n = 3; else if (nomeLower.includes('gen4')) n = 4; else if (nomeLower.includes('gen5')) n = 5; else n = 2;
  } else if (cat === 'ram') {
    if (nomeLower.includes('ddr3')) n = 1; else if (nomeLower.includes('ddr4') && preco < 300) n = 2; else if (nomeLower.includes('ddr4')) n = 3; else if (nomeLower.includes('ddr5') && preco < 1000) n = 4; else n = 5;
  } else {
    if (preco < 100) n = 1; else if (preco < 250) n = 2; else if (preco < 500) n = 3; else if (preco < 1000) n = 4; else n = 5;
  }
  return '⭐'.repeat(n);
};

export const getOpcoesCompativeis = (categoria, setup) => {
  if (categoria === 'mb' || categoria === 'cpu') return setup.socket ? getPartList(categoria, setup.socket) : [];
  if (categoria === 'ram' && setup.mb) {
    const mb = findPart('mb', setup.mb, setup.socket);
    if (mb?.ramType) return getPartList('ram').filter(r => r.ramType === mb.ramType);
  }
  if (categoria === 'case' && setup.mb) {
    return getPartList('case').filter(item => item.id === 'case_none' || caseSupports(item.id, setup.mb));
  }
  if (categoria === 'psu' && setup.cpu && setup.gpu) {
    const required = getRecommendedPsuWattage(setup);
    return getPartList('psu').filter(item => !psuWattMap[item.id] || psuWattMap[item.id] >= required);
  }
  return getPartList(categoria);
};

export const calcularTotalAtual = (setup) => calculateSetupTotal(setup);
export const calcularAvisoGargalo = (setup) => estimateBalance(setup);

export const getRecommendedPsuWattage = (setup) => {
  const gpuIds = getSelectionIds(setup.gpu);
  const gpuTdp = gpuIds.length ? Math.max(...gpuIds.map(id => gpuTdpMap[id] || 0)) : 0;
  const cpuTdp = setup.cpu ? (cpuTdpMap[setup.cpu] || 65) : 0;
  const baseSystem = 80;
  return Math.ceil(((cpuTdp + gpuTdp + baseSystem) * 1.25) / 50) * 50;
};

export const validarFonte = (setup) => {
  if (!setup.psu || !setup.cpu || !setup.gpu) return null;
  const recommended = getRecommendedPsuWattage(setup);
  const psuW = psuWattMap[setup.psu] || 0;
  if (psuW > 0 && psuW < recommended) {
    return { titulo: '🔋 FONTE INSUFICIENTE!', msg: `Para esta combinação, a recomendação estimada é de pelo menos ${recommended}W. A fonte selecionada tem ${psuW}W.` };
  }
  return null;
};

export const validarGabinete = (setup) => {
  if (!setup.case || setup.case === 'case_none' || !setup.mb) return null;
  if (caseSupports(setup.case, setup.mb)) return null;
  const mf = mbFormFactorMap[setup.mb] || 'ATX';
  const cf = caseFormFactorMap[setup.case] || 'ATX';
  return { titulo: '📦 GABINETE INCOMPATÍVEL!', msg: `A Placa-Mãe é ${mf}, mas o gabinete selecionado suporta até ${cf}.` };
};

export const validarMemoria = (setup) => {
  if (!setup.mb || !Array.isArray(setup.ram) || setup.ram.length === 0) return null;
  const mb = findPart('mb', setup.mb, setup.socket);
  if (!mb?.ramType) return null;
  const incompat = setup.ram.map(id => findPart('ram', id, setup.socket)).filter(Boolean).find(ram => ram.ramType && ram.ramType !== mb.ramType);
  if (!incompat) return null;
  return { titulo: '⚡ MEMÓRIA INCOMPATÍVEL!', msg: `A placa-mãe usa ${mb.ramType}, mas foi selecionada uma memória ${incompat.ramType}.` };
};

export const validarPlataforma = (setup) => {
  if (!setup.socket) return null;
  if (setup.mb && !findPart('mb', setup.mb, setup.socket)) return { titulo: '🖲️ PLACA-MÃE INCOMPATÍVEL!', msg: `A placa-mãe selecionada não pertence à plataforma ${setup.socket}.` };
  if (setup.cpu && !findPart('cpu', setup.cpu, setup.socket)) return { titulo: '🧠 PROCESSADOR INCOMPATÍVEL!', msg: `O processador selecionado não pertence à plataforma ${setup.socket}.` };
  return null;
};

export const validarCompatibilidadeCompleta = (setup) => validarPlataforma(setup) || validarMemoria(setup) || validarFonte(setup) || validarGabinete(setup);
