import type { GatewayEvent } from './gateway-event';
/** Synthetic request trace; HTTP status is transport metadata. */
export interface GatewayTrace { readonly requestId: string; readonly tenantId: string; readonly httpStatus: number; readonly events: readonly GatewayEvent[] }
