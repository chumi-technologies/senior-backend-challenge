import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { checkReplayOutput } from './check-replay-output';
function executeTarget(target: string, input: string): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, ['--import', 'tsx', 'scripts/replay-target.ts', '--target', target], { input, encoding: 'utf8', timeout: 10000 });
}
describe('starter protocol, not solution correctness', (): void => {
  it.each(['submission/gateway.ts', 'proposals/change-a.ts', 'proposals/change-b.ts'])('executes the selected module %s', (target: string): void => {
    const result: SpawnSyncReturns<string> = executeTarget(target, JSON.stringify({ schemaVersion: 2, traces: [] }));
    expect(result.status).toBe(0);
    expect(checkReplayOutput(JSON.parse(result.stdout) as unknown, [])).toEqual([]);
  });
  it('rejects malformed JSON without partial stdout', (): void => {
    const result: SpawnSyncReturns<string> = executeTarget('submission/gateway.ts', '{');
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('REPLAY_FAILED');
  });
  it('keeps one self-service private-copy delivery path and aligned entrypoints', (): void => {
    for (const path of ['README.md', 'START-HERE.md', 'docs/SUBMISSION.md']) {
      const content: string = readFileSync(path, 'utf8');
      expect(content).not.toMatch(/assigned private template-generated repo|Clone your assigned|founder must assign/i);
    }
    for (const path of ['CLAUDE.md', 'GEMINI.md', '.windsurfrules', '.cursor/rules/challenge.mdc']) expect(readFileSync(path, 'utf8')).toContain('AGENTS.md');
  });
});
