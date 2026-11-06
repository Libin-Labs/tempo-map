function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
export interface TempoChange {
  beat: number;
  bpm: number;
}
export interface TempoMap {
  beatToSeconds(beat: number): number;
  secondsToBeat(seconds: number): number;
}
export function createTempoMap(changes: readonly TempoChange[]): TempoMap {
  if (!Array.isArray(changes) || !changes.length || changes.length > 10000)
    throw new RangeError('Tempo count');
  const beats: number[] = [],
    bpms: number[] = [],
    times: number[] = [];
  for (const c of changes) {
    if (!c) throw new TypeError('Expected change');
    finite(c.beat, 0, 1e9);
    finite(c.bpm, Number.MIN_VALUE, 1000);
    if ((!beats.length && c.beat !== 0) || (beats.length && c.beat <= beats[beats.length - 1]!))
      throw new RangeError('Increasing changes from zero required');
    const t = beats.length
      ? finite(
          times[times.length - 1]! +
            ((c.beat - beats[beats.length - 1]!) * 60) / bpms[bpms.length - 1]!,
          0,
        )
      : 0;
    if (times.length && t <= times[times.length - 1]!)
      throw new RangeError('Tempo interval below resolution');
    beats.push(c.beat);
    bpms.push(c.bpm);
    times.push(t);
  }
  function index(values: readonly number[], q: number): number {
    let lo = 0,
      hi = values.length;
    while (lo + 1 < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (values[mid]! <= q) lo = mid;
      else hi = mid;
    }
    return lo;
  }
  return {
    beatToSeconds(beat: number) {
      finite(beat, 0, 1e9);
      const i = index(beats, beat);
      return finite(times[i]! + ((beat - beats[i]!) * 60) / bpms[i]!, 0);
    },
    secondsToBeat(seconds: number) {
      finite(seconds, 0, 1e9);
      const i = index(times, seconds);
      return finite(beats[i]! + ((seconds - times[i]!) * bpms[i]!) / 60, 0);
    },
  };
}
