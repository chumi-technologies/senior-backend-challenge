import type { RouteResult } from './route-result';
/** One complete JSON response envelope, with exactly one outcome per request. */
export interface RouteOutput {
  readonly schemaVersion: 1;
  readonly results: readonly RouteResult[];
}
