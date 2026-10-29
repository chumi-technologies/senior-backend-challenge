import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectSourceRevision } from './collect-source-revision';
import { verifySubmission } from './verify-submission';
const inputProposalIds: readonly string[] = ['P1', 'P2'];
let repositoryRoot: string;
function writeInputFile(path: string, content: string): void {
  writeFileSync(join(repositoryRoot, path), content);
}
function saveEvidence(): void {
  const inputEvidence: unknown = { schemaVersion: 1, status: 'completed', revision: collectSourceRevision(repositoryRoot), checks: [{ command: 'pnpm test:submission', executedAt: '2026-10-26T19:00:00Z', status: 'passed', exitCode: 0, testsExecuted: 1 }] };
  writeInputFile('submission/evidence.json', JSON.stringify(inputEvidence));
}
beforeEach((): void => {
  repositoryRoot = mkdtempSync(join(tmpdir(), 'challenge-structure-'));
  execFileSync('git', ['init', '-q'], { cwd: repositoryRoot });
  execFileSync('git', ['-c', 'user.name=Tooling Test', '-c', 'user.email=tooling@example.invalid', 'commit', '--allow-empty', '-qm', 'test baseline'], { cwd: repositoryRoot });
  mkdirSync(join(repositoryRoot, 'submission'));
  mkdirSync(join(repositoryRoot, 'challenge/fixtures'), { recursive: true });
  symlinkSync(join(process.cwd(), 'node_modules'), join(repositoryRoot, 'node_modules'));
  writeInputFile('challenge/advisory-packet.json', JSON.stringify({ schemaVersion: 1, packetId: 'assigned-sample', scored: true, classification: 'untrusted-simulation', stage: 'before-implementation', proposals: inputProposalIds.map((id: string): Record<string, string> => ({ id, claim: 'Synthetic claim.' })) }));
  ['notes.md', 'system-design.md'].forEach((filename: string): void => writeInputFile(`submission/${filename}`, 'Completed example for a structural tooling test, not a route solution.'));
  writeInputFile('challenge/fixtures/routing-cases.json', JSON.stringify({ requests: [{ id: 'schema-only' }] }));
  writeInputFile('submission/route-cli.ts', 'process.stdout.write(JSON.stringify({schemaVersion:1,results:[{requestId:"schema-only",status:"refused",reason:"no_compatible_cell"}]}));');
  writeInputFile('submission/judgment.json', JSON.stringify({ schemaVersion: 1, packetId: 'assigned-sample', status: 'completed', authorship: 'candidate_declared_unobserved', decisions: inputProposalIds.map((proposalId: string): Record<string, unknown> => ({ proposalId, initialDecision: 'defer', finalDecision: 'defer', source: 'Synthetic structure only.', prediction: 'Synthetic prediction.', predictedAt: '2026-10-26T19:00:00Z', command: 'Synthetic check only.', observedAt: '2026-10-26T19:01:00Z', observation: 'Synthetic observation.', reason: 'Synthetic rationale.', reversalCondition: 'Synthetic reversal condition.' })) }));
  saveEvidence();
});
afterEach((): void => rmSync(repositoryRoot, { recursive: true, force: true }));
describe('candidate-local structural verification module', (): void => {
  it('accepts complete structure without claiming route correctness', async (): Promise<void> => {
    const actualErrors: readonly string[] = await verifySubmission(repositoryRoot);
    expect(actualErrors).toEqual([]);
  });
  it('refuses unfinished documents before invoking the adapter', async (): Promise<void> => {
    writeInputFile('submission/notes.md', 'Status: NOT_COMPLETED');
    saveEvidence();
    expect(await verifySubmission(repositoryRoot)).toContain('Complete submission/notes.md with actual work.');
  });
  it('enforces document word limits, counting each Han character as a word', async (): Promise<void> => {
    writeInputFile('submission/notes.md', 'word '.repeat(600));
    writeInputFile('submission/system-design.md', '字'.repeat(500));
    saveEvidence();
    expect(await verifySubmission(repositoryRoot)).toEqual([]);
    writeInputFile('submission/notes.md', 'word '.repeat(601));
    writeInputFile('submission/system-design.md', '字'.repeat(501));
    saveEvidence();
    expect(await verifySubmission(repositoryRoot)).toEqual(['Shorten submission/notes.md to at most 600 words (found 601).', 'Shorten submission/system-design.md to at most 500 words (found 501).']);
  });
  it('rejects an adapter failure and malformed output', async (): Promise<void> => {
    writeInputFile('submission/route-cli.ts', 'process.exitCode = 2;');
    saveEvidence();
    expect((await verifySubmission(repositoryRoot)).length).toBeGreaterThan(0);
    writeInputFile('submission/route-cli.ts', 'process.stdout.write("not JSON");');
    saveEvidence();
    await expect(verifySubmission(repositoryRoot)).rejects.toThrow();
  });
  it('detects stale source evidence', async (): Promise<void> => {
    writeInputFile('submission/route-cli.ts', 'process.exitCode = 2;');
    expect(await verifySubmission(repositoryRoot)).toContain('Evidence source fingerprint does not match the current submission.');
  });
  it('fails when the result omits the requested ID', async (): Promise<void> => {
    writeInputFile('submission/route-cli.ts', 'process.stdout.write(JSON.stringify({schemaVersion:1,results:[]}));');
    saveEvidence();
    expect((await verifySubmission(repositoryRoot)).length).toBeGreaterThan(0);
  });
  it('does not turn missing artifacts into a successful check', async (): Promise<void> => {
    rmSync(join(repositoryRoot, 'submission/evidence.json'));
    await expect(verifySubmission(repositoryRoot)).rejects.toThrow();
  });
});
