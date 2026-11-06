import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('constant120', () => {
  const m = api.createTempoMap([{ beat: 0, bpm: 120 }]);
  assert.equal(m.beatToSeconds(4), 2);
  assert.equal(m.secondsToBeat(2), 4);
});
test('tempo change boundary', () => {
  const m = api.createTempoMap([
    { beat: 0, bpm: 120 },
    { beat: 4, bpm: 60 },
  ]);
  assert.equal(m.beatToSeconds(6), 4);
  assert.equal(m.secondsToBeat(3), 5);
});
test('input snapshot', () => {
  const c = [{ beat: 0, bpm: 120 }],
    m = api.createTempoMap(c);
  c[0].bpm = 60;
  assert.equal(m.beatToSeconds(2), 1);
});
test('extrapolated final segment', () => {
  assert.equal(api.createTempoMap([{ beat: 0, bpm: 60 }]).beatToSeconds(100), 100);
});
test('invalid changes', () => {
  assert.throws(() => api.createTempoMap([]));
  assert.throws(() => api.createTempoMap([{ beat: 1, bpm: 120 }]));
  assert.throws(() => api.createTempoMap([{ beat: 0, bpm: 0 }]));
});
test('independent segment integration', () => {
  const m = api.createTempoMap([
    { beat: 0, bpm: 120 },
    { beat: 4, bpm: 60 },
    { beat: 8, bpm: 180 },
  ]);
  for (let b = 0; b <= 20; b += 0.25) {
    const expected =
      Math.min(b, 4) * 0.5 + Math.max(0, Math.min(b - 4, 4)) + Math.max(0, b - 8) / 3;
    assert.ok(Math.abs(m.beatToSeconds(b) - expected) < 1e-12);
    assert.ok(Math.abs(m.secondsToBeat(expected) - b) < 1e-12);
  }
});
