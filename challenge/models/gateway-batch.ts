import type { GatewayTrace } from './gateway-trace';
/** Immutable offline replay input. */
export interface GatewayBatch { readonly schemaVersion: 2; readonly traces: readonly GatewayTrace[] }
