import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, writeJson } from '../services/storage.js';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}

test('storage serializa e recupera JSON', () => {
  globalThis.localStorage = new MemoryStorage();
  assert.equal(writeJson('x', { ok: true }), true);
  assert.deepEqual(readJson('x', {}), { ok: true });
});

test('storage retorna fallback para JSON corrompido', () => {
  globalThis.localStorage = new MemoryStorage();
  globalThis.localStorage.setItem('x', '{');
  assert.deepEqual(readJson('x', []), []);
});
