import type { RouteCell } from './route-cell';
import type { RouteRequest } from './route-request';
/** A complete independent offline planning invocation with an injectable clock. */
export interface RouteBatch {
  readonly schemaVersion: 1;
  readonly now: string;
  readonly freshness: { readonly probeMaxAgeSeconds: number; readonly priceMaxAgeSeconds: number };
  readonly requests: readonly RouteRequest[];
  readonly cells: readonly RouteCell[];
}
