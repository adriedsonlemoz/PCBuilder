import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSetupTotal, findPart } from '../domain/parts.js';
import { getRecommendedPsuWattage, validarMemoria } from '../features/builder/builderUtils.js';
import { buildUpgradeSuggestions } from '../features/home/upgradeUtils.js';

test('busca peça por categoria/socket', () => {
  assert.equal(findPart('cpu', 'c_am4_1', 'AM4')?.id, 'c_am4_1');
  assert.equal(findPart('cpu', 'c_am4_1', 'AM5'), null);
});

test('calcula total de um setup', () => {
  const setup = { socket: 'AM4', cpu: 'c_am4_1', mb: 'm_am4_1', ram: ['ram_d4_1'] };
  const expected = findPart('cpu', 'c_am4_1', 'AM4').price + findPart('mb', 'm_am4_1', 'AM4').price + findPart('ram', 'ram_d4_1').price;
  assert.equal(calculateSetupTotal(setup), expected);
});

test('detecta RAM incompatível', () => {
  const result = validarMemoria({ socket: 'AM4', mb: 'm_am4_1', ram: ['ram_d5_1'] });
  assert.ok(result?.titulo.includes('MEMÓRIA'));
});

test('fonte recomendada inclui margem', () => {
  const watts = getRecommendedPsuWattage({ cpu: 'c_am4_7', gpu: 'gpu_high_1' });
  assert.ok(watts >= 400);
});

test('upgrade respeita orçamento adicional', () => {
  const setup = { parts: { socket: 'AM4', cpu: 'c_am4_1', gpu: 'gpu_ent_1', ram: ['ram_d4_1'], storage: ['st_hdd_1'] } };
  const suggestions = buildUpgradeSuggestions(setup, 800);
  assert.ok(suggestions.every(item => item.diferenca <= 800));
});
