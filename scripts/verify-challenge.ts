import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { checkPublicBoundary } from './checks/check-public-boundary';
const REQUIRED_PATHS: readonly string[] = ['README.md', 'AGENTS.md', 'START-HERE.md', 'challenge/CONTRACT.md', 'challenge/SESSION.md', 'challenge/EVIDENCE.md', 'challenge/JUDGMENT.md', 'case/incident.json', 'case/replay.json', 'case/review-notes.md', 'proposals/change-a.ts', 'proposals/change-b.ts', 'submission/gateway.ts', 'submission/verify.ts', 'submission/decision.json', 'submission/update.json', 'submission/evidence.json', 'submission/notes.md', 'submission/system-design.md'];
function executeStarterCheck(): void {
  REQUIRED_PATHS.forEach((path: string): void => { readFileSync(path, 'utf8'); });
  const paths: readonly string[] = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter((path: string): boolean => path.length > 0))];
  const files: readonly { readonly path: string; readonly content: string }[] = paths.filter((path: string): boolean => existsSync(path)).map((path: string): { readonly path: string; readonly content: string } => ({ path, content: readFileSync(path, 'utf8') }));
  const errors: readonly string[] = checkPublicBoundary(files);
  if (errors.length > 0) throw new Error(errors.join('\n'));
  process.stdout.write('STARTER_ONLY: candidate inputs and public boundary checks passed; no solution or human judgment is certified.\n');
}
try { executeStarterCheck(); } catch (error: unknown) {
  process.stderr.write(`STARTER_CHECK_FAILED: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
