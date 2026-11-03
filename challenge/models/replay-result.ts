/** Customer-observable reconciliation result for one request. */
export interface ReplayResult { readonly requestId: string; readonly status: 'delivered' | 'interrupted' | 'cancelled'; readonly deliveredChunks: number; readonly billedUnits: number }
