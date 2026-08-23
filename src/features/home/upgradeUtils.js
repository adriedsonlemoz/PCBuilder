import { getPartList, getPrimaryPart, getSelectionIds } from '../../domain/parts.js';

const categoryWeight = { gpu: 100, cpu: 90, ram: 55, storage: 45, psu: 25, monitor: 35 };
const performanceScore = (category, part) => {
  if (!part) return 0;
  const name = (part.name || '').toLowerCase();
  let score = Math.log10(Math.max(1, part.price) + 10) * 20;
  if (category === 'storage') { if (name.includes('gen5')) score += 30; else if (name.includes('gen4')) score += 20; else if (name.includes('nvme')) score += 12; else if (name.includes('hdd')) score -= 15; }
  if (category === 'ram') { if (name.includes('ddr5')) score += 16; else if (name.includes('ddr4')) score += 8; const gb = Number(name.match(/(\d+)gb/)?.[1] || 0); score += Math.min(gb, 64) * 0.5; }
  return score;
};

export const buildUpgradeSuggestions = (savedSetup, budget) => {
  if (!savedSetup?.parts || budget <= 0) return [];
  const setup = savedSetup.parts;
  const categories = [
    ['gpu', '🎮 Placa Gráfica'], ['cpu', '🧠 Processador'], ['ram', '⚡ Memória RAM'],
    ['storage', '💾 Armazenamento'], ['psu', '🔋 Fonte'], ['monitor', '🖥️ Monitor'],
  ];
  const suggestions = [];
  categories.forEach(([cat, label]) => {
    const ids = getSelectionIds(setup[cat]);
    if (!ids.length) return;
    const current = getPrimaryPart(setup, cat);
    if (!current || current.price <= 0) return;
    const currentScore = performanceScore(cat, current);
    const candidates = getPartList(cat, setup.socket)
      .filter(p => p.id !== current.id && p.price > current.price && p.price - current.price <= budget)
      .map(p => {
        const extra = p.price - current.price;
        const gain = Math.max(0.1, performanceScore(cat, p) - currentScore);
        const value = (gain * (categoryWeight[cat] || 20)) / Math.max(extra, 1);
        return { p, extra, gain, value };
      })
      .sort((a, b) => b.value - a.value || b.gain - a.gain || a.extra - b.extra);
    if (!candidates.length) return;
    const best = candidates[0];
    suggestions.push({ cat, label, atual: current.name, precoAtual: current.price, sugerido: best.p.name, precoSugerido: best.p.price, diferenca: best.extra, impacto: Math.max(1, Math.min(5, Math.round(best.gain / 8) + 1)), custoBeneficio: best.value });
  });
  return suggestions.sort((a, b) => b.custoBeneficio - a.custoBeneficio || b.impacto - a.impacto);
};

export const estimateBalance = (setup) => {
  const cpu = getPrimaryPart(setup, 'cpu');
  const gpu = getPrimaryPart(setup, 'gpu');
  if (!cpu || !gpu || gpu.id === 'gpu_int') return null;
  const cpuScore = performanceScore('cpu', cpu);
  const gpuScore = performanceScore('gpu', gpu);
  const ratio = gpuScore / Math.max(cpuScore, 1);
  if (ratio > 1.48) return { tipo: 'cpu', severidade: ratio > 1.8 ? 'alta' : 'moderada', msg: '⚠️ Equilíbrio: o processador pode limitar a placa de vídeo em cenários dependentes de CPU.' };
  if (ratio < 0.68) return { tipo: 'gpu', severidade: ratio < 0.52 ? 'alta' : 'moderada', msg: '⚠️ Equilíbrio: a placa de vídeo é o componente mais fraco para jogos neste conjunto.' };
  return null;
};
