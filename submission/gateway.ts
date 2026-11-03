import type { GatewayBatch } from '../challenge/models/gateway-batch';
import type { GatewayReplay } from '../challenge/models/gateway-replay';
import { replayBatch as replayCurrentBatch } from '../challenge/runtime/current-gateway';
/** Candidate-owned seam; replace or adapt the existing implementation after the decision checkpoint. */
export function replayBatch(batch: GatewayBatch): GatewayReplay {
  return replayCurrentBatch(batch);
}
