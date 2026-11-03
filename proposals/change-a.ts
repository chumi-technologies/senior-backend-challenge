import type { GatewayBatch } from '../challenge/models/gateway-batch';
import type { GatewayReplay } from '../challenge/models/gateway-replay';
import type { GatewayTrace } from '../challenge/models/gateway-trace';
import type { ReplayResult } from '../challenge/models/replay-result';
function reconcileTrace(trace: GatewayTrace): ReplayResult {
  const completion: GatewayTrace['events'][number] | undefined = trace.events.find((event: GatewayTrace['events'][number]): boolean => event.kind === 'upstream-complete');
  return { requestId: trace.requestId, status: completion ? 'delivered' : 'interrupted', deliveredChunks: trace.events.filter((event: GatewayTrace['events'][number]): boolean => event.kind === 'chunk').length, billedUnits: completion?.kind === 'upstream-complete' ? completion.units : 0 };
}
/** Incoming patch A: author claims upstream completion removes transport-only false positives. */
export function replayBatch(batch: GatewayBatch): GatewayReplay {
  return { schemaVersion: 2, results: batch.traces.map(reconcileTrace) };
}
