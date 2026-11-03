import type { GatewayBatch } from '../models/gateway-batch';
import type { GatewayReplay } from '../models/gateway-replay';
import type { GatewayTrace } from '../models/gateway-trace';
import type { ReplayResult } from '../models/replay-result';
function reconcileTrace(trace: GatewayTrace): ReplayResult {
  const completion: GatewayTrace['events'][number] | undefined = trace.events.find((event: GatewayTrace['events'][number]): boolean => event.kind === 'upstream-complete');
  return { requestId: trace.requestId, status: trace.httpStatus === 200 ? 'delivered' : 'interrupted', deliveredChunks: trace.events.filter((event: GatewayTrace['events'][number]): boolean => event.kind === 'chunk').length, billedUnits: completion?.kind === 'upstream-complete' ? completion.units : 0 };
}
/** Existing implementation supplied for incident investigation, not an oracle. */
export function replayBatch(batch: GatewayBatch): GatewayReplay {
  return { schemaVersion: 2, results: batch.traces.map(reconcileTrace) };
}
