import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import type { GatewayBatch } from '../challenge/models/gateway-batch';
import { checkSubmissionRecords } from './checks/check-submission-records';
import { checkReplayOutput } from './checks/check-replay-output';
import { collectSourceRevision } from './checks/collect-source-revision';
import { isRecord } from './checks/is-record';
function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}
function executeSubmissionCheck(): void {
  const evidence: unknown = readJson('submission/evidence.json');
  const errors: string[] = [...checkSubmissionRecords({ decision: readJson('submission/decision.json'), evidence, update: readJson('submission/update.json'), notes: readFileSync('submission/notes.md', 'utf8'), design: readFileSync('submission/system-design.md', 'utf8') })];
  if (isRecord(evidence) && isRecord(evidence.revision) && evidence.revision.diffSha256 !== collectSourceRevision(process.cwd()).diffSha256) errors.push('Source fingerprint mismatch: regenerate the receipt on this checkout/platform');
  const input: string = readFileSync('case/replay.json', 'utf8');
  const batch: GatewayBatch = JSON.parse(input) as GatewayBatch;
  const output: unknown = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', 'scripts/replay-target.ts'], { input, encoding: 'utf8', timeout: 30000, maxBuffer: 1048576 })) as unknown;
  errors.push(...checkReplayOutput(output, batch.traces.map((trace: GatewayBatch['traces'][number]): string => trace.requestId)));
  if (errors.length > 0) throw new Error(errors.join('\n'));
  process.stdout.write('STRUCTURE_ONLY: declarations, current source fingerprint and response shape are valid; correctness, actual chronology and independent human reasoning are not certified.\n');
}
try { executeSubmissionCheck(); } catch (error: unknown) {
  process.stderr.write(`INCOMPLETE: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
