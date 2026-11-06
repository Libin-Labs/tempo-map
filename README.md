# @lp-labs/tempo-map

Copied piecewise-constant tempo maps with beat/time inverse lookup.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/tempo-map
```

## Working example

```js
import { createTempoMap } from '@lp-labs/tempo-map';
const map = createTempoMap([
  { beat: 0, bpm: 120 },
  { beat: 4, bpm: 60 },
]);
if (map.beatToSeconds(6) !== 4) throw new Error('Tempo');
```

CommonJS: `const api = require('@lp-labs/tempo-map')`.

## Behavior, customization and limits

createTempoMap requires1..10000 {beat,bpm}, first beat0, strictly increasing beat<=1e9 and BPM(0,1000]. Returns beatToSeconds and secondsToBeat; nonnegative finite queries<=1e9; final tempo extrapolates. Tempo changes right-continuous, quarter-note units. Precompute cumulative seconds; O(N) construction,O(log N) lookup. No ramps, MIDI timing or timers; finite output and positive interval resolution enforced.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export interface TempoChange {
  beat: number;
  bpm: number;
}
export interface TempoMap {
  beatToSeconds(beat: number): number;
  secondsToBeat(seconds: number): number;
}
export declare function createTempoMap(changes: readonly TempoChange[]): TempoMap;
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
