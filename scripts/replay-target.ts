import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import type { GatewayBatch } from '../challenge/models/gateway-batch';
import type { GatewayReplay } from '../challenge/models/gateway-replay';
import { isRecord } from './checks/is-record';
type ReplayFunction = (batch: GatewayBatch) => GatewayReplay;
function readTargetPath(): string {
  const argumentsList: readonly string[] = process.argv.slice(2);
  if (argumentsList.length === 0) return resolve('submission/gateway.ts');
  if (argumentsList.length !== 2 || argumentsList[0] !== '--target') throw new Error('Usage: incident:replay [--target <module.ts>]');
  return resolve(argumentsList[1]);
}
async function executeReplay(): Promise<void> {
  const moduleValue: unknown = await import(pathToFileURL(readTargetPath()).href);
  if (!isRecord(moduleValue) || typeof moduleValue.replayBatch !== 'function') throw new Error('Target must export replayBatch');
  const replayBatch: ReplayFunction = moduleValue.replayBatch as ReplayFunction;
  const batch: GatewayBatch = JSON.parse(readFileSync(0, 'utf8')) as GatewayBatch;
  process.stdout.write(JSON.stringify(await replayBatch(batch)) + '\n');
}
void executeReplay().catch((error: unknown): void => {
  process.stderr.write(`REPLAY_FAILED: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
