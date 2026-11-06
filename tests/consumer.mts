import { createTempoMap } from '@lp-labs/tempo-map';
const map = createTempoMap([
  { beat: 0, bpm: 120 },
  { beat: 4, bpm: 60 },
]);
if (map.beatToSeconds(6) !== 4) throw new Error('Tempo');
// @ts-expect-error invalid argument must be rejected by declarations
createTempoMap([{ beat: 0, bpm: '120' }]);
