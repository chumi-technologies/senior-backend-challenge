import type { GatewayBatch } from '../challenge/models/gateway-batch';
import type { GatewayReplay } from '../challenge/models/gateway-replay';
import { replayBatch as replayCurrentBatch } from '../challenge/runtime/current-gateway';
/** Incoming patch B: author claims noisy failures should not distort the successful-service dashboard. */
export function replayBatch(batch: GatewayBatch): GatewayReplay {
  return replayCurrentBatch({ ...batch, traces: batch.traces.filter((trace: GatewayBatch['traces'][number]): boolean => !trace.events.some((event: GatewayBatch['traces'][number]['events'][number]): boolean => event.kind === 'provider-error' || event.kind === 'client-cancel')) });
}
