import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { checkPublicBoundary } from './checks/check-public-boundary';
import { isRecord } from './checks/is-record';
const REQUIRED_PATHS: readonly string[] = ['README.md', 'AGENTS.md', 'challenge/CONTRACT.md', 'challenge/SESSION.md', 'challenge/EVIDENCE.md', 'challenge/fixtures/routing-cases.json', 'challenge/advisory-packet.json', 'challenge/JUDGMENT.md', 'submission/judgment.json', 'submission/notes.md', 'submission/system-design.md', 'submission/route-cli.ts', 'submission/evidence.json', 'scripts/verify-submission.ts', 'START-HERE.md'];
async function readPublicFiles(root: string): Promise<readonly { readonly path: string; readonly content: string }[]> {
  const output: string = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' });
  const paths: readonly string[] = [...new Set(output.split('\0').filter((path: string): boolean => path.length > 0))];
  return Promise.all(paths.map(async (path: string): Promise<{ readonly path: string; readonly content: string }> => ({ path, content: await readFile(join(root, path), 'utf8') })));
}
async function executeChallengeCheck(): Promise<void> {
  const root: string = process.cwd();
  await Promise.all(REQUIRED_PATHS.map((path: string): Promise<string> => readFile(join(root, path), 'utf8')));
  const fixture: unknown = JSON.parse(await readFile(join(root, 'challenge/fixtures/routing-cases.json'), 'utf8'));
  if (!isRecord(fixture) || fixture.schemaVersion !== 1 || typeof fixture.now !== 'string' || !Number.isFinite(Date.parse(fixture.now)) || !Array.isArray(fixture.requests) || !Array.isArray(fixture.cells)) throw new Error('Routing fixture must contain the published clocked batch envelope.');
  const files: readonly { readonly path: string; readonly content: string }[] = await readPublicFiles(root);
  const errors: readonly string[] = checkPublicBoundary(files);
  if (errors.length > 0) throw new Error(errors.join('\n'));
  process.stdout.write('STARTER_ONLY: required inputs, protocol clock, and public boundary checks passed. No solution, human checkpoint, or correctness verdict is certified.\n');
}
void executeChallengeCheck().catch((error: unknown): void => {
  process.stderr.write(`STARTER_CHECK_FAILED: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
