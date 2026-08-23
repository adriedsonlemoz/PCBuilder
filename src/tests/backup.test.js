import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBackup } from '../services/backupService.js';

test('backup legado v1 é migrado', () => {
  const data = normalizeBackup({ setups: { PC: {} }, custom: [{ peca: { id: 'x' } }] });
  assert.equal(data.backupVersion, 1);
  assert.equal(data.customParts.length, 1);
  assert.deepEqual(data.editedParts, {});
});

test('backup v2 preserva peças editadas', () => {
  const data = normalizeBackup({ backupVersion: 2, setups: {}, customParts: [], editedParts: { p1: { name: 'X', price: 1 } } });
  assert.equal(data.backupVersion, 2);
  assert.equal(data.editedParts.p1.name, 'X');
});
