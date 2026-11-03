import type { ReplayResult } from './replay-result';
/** One result per input request, without transport-only success claims. */
export interface GatewayReplay { readonly schemaVersion: 2; readonly results: readonly ReplayResult[] }
