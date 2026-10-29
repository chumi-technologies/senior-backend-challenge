import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readAdvisoryPacket, type AdvisoryPacket } from './advisory-packet';
import { checkJudgment } from './check-judgment';
import { checkEvidence } from './check-evidence';
import { checkRouteOutput } from './check-route-output';
import { collectSourceRevision } from './collect-source-revision';
import { isRecord } from './is-record';
/** Word limits keep the record reviewable; each Han character counts as one word. */
const DOCUMENT_WORD_LIMITS: Readonly<Record<string, number>> = { 'notes.md': 600, 'system-design.md': 500 };
const WORD_PATTERN: RegExp = /\p{Script=Han}|[^\s\p{Script=Han}]+/gu;
const EXECUTION_TIMEOUT_MS: number = 10_000;
const MAX_OUTPUT_BYTES: number = 1_048_576;
async function checkDocument(root: string, filename: string): Promise<readonly string[]> {
  const text: string = await readFile(join(root, 'submission', filename), 'utf8');
  if (/Status:\s*NOT_COMPLETED/.test(text) || text.trim().length === 0) return [`Complete submission/${filename} with actual work.`];
  const words: number = text.match(WORD_PATTERN)?.length ?? 0;
  return words > DOCUMENT_WORD_LIMITS[filename] ? [`Shorten submission/${filename} to at most ${DOCUMENT_WORD_LIMITS[filename]} words (found ${words}).`] : [];
}
function checkSourceFingerprint(root: string, evidence: unknown): readonly string[] {
  if (!isRecord(evidence) || !isRecord(evidence.revision)) return [];
  return evidence.revision.diffSha256 === collectSourceRevision(root).diffSha256 ? [] : ['Evidence source fingerprint does not match the current submission.'];
}
async function checkAdapter(root: string): Promise<readonly string[]> {
  const input: string = await readFile(join(root, 'challenge/fixtures/routing-cases.json'), 'utf8');
  const parsed: unknown = JSON.parse(input);
  if (!isRecord(parsed) || !Array.isArray(parsed.requests)) throw new Error('Starter request fixture is invalid.');
  const requestIds: readonly string[] = parsed.requests.map((request: unknown): string => {
    if (!isRecord(request) || typeof request.id !== 'string') throw new Error('Starter request IDs are invalid.');
    return request.id;
  });
  const result: SpawnSyncReturns<string> = spawnSync(process.execPath, ['--import', 'tsx', 'submission/route-cli.ts'], { cwd: root, encoding: 'utf8', input, timeout: EXECUTION_TIMEOUT_MS, maxBuffer: MAX_OUTPUT_BYTES, shell: false });
  if (result.error || result.status !== 0) return ['Route adapter did not complete successfully; inspect your local command and stderr.'];
  return checkRouteOutput({ output: JSON.parse(result.stdout) as unknown, requestIds });
}
/** Run candidate-local structural checks; never award a correctness or hiring verdict. */
export async function verifySubmission(root: string): Promise<readonly string[]> {
  const packet: AdvisoryPacket = readAdvisoryPacket(JSON.parse(await readFile(join(root, 'challenge/advisory-packet.json'), 'utf8')));
  const judgment: unknown = JSON.parse(await readFile(join(root, 'submission/judgment.json'), 'utf8'));
  const evidence: unknown = JSON.parse(await readFile(join(root, 'submission/evidence.json'), 'utf8'));
  const documents: readonly (readonly string[])[] = await Promise.all(Object.keys(DOCUMENT_WORD_LIMITS).map((filename: string): Promise<readonly string[]> => checkDocument(root, filename)));
  const errors: readonly string[] = [...documents.flat(), ...checkEvidence(evidence), ...checkJudgment(judgment, packet), ...checkSourceFingerprint(root, evidence)];
  if (errors.length > 0) return errors;
  return checkAdapter(root);
}
