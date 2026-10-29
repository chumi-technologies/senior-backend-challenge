import { checkEvidence } from './check-evidence';
type EvidenceInput = { readonly revision: { readonly headSha: string; readonly isDirty: boolean; readonly diffSha256: string }; readonly schemaVersion: number; readonly status: string; readonly checks: readonly Record<string, unknown>[] };
function createEvidence(): EvidenceInput {
  return { schemaVersion: 1, status: 'completed', revision: { headSha: 'a'.repeat(40), isDirty: true, diffSha256: 'b'.repeat(64) }, checks: [{ command: 'pnpm test:submission', executedAt: '2026-10-26T19:00:00Z', status: 'passed', exitCode: 0, testsExecuted: 1 }] };
}
describe('candidate-declared evidence structure', (): void => {
  it('accepts a documented receipt and honest unavailable check', (): void => {
    const inputEvidence: EvidenceInput = createEvidence();
    const actualErrors: readonly string[] = checkEvidence({ ...inputEvidence, checks: [...inputEvidence.checks, { command: 'optional local check', executedAt: '2026-10-26T19:00:00Z', status: 'unavailable', exitCode: null, reason: 'Not installed.' }] });
    expect(actualErrors).toEqual([]);
  });
  it.each([null, { schemaVersion: 1, status: 'not_completed', checks: [] }, { schemaVersion: 1, status: 'completed', checks: [] }])('rejects incomplete evidence %p', (inputEvidence: unknown): void => {
    expect(checkEvidence(inputEvidence).length).toBeGreaterThan(0);
  });
  it.each([
    { command: 'pnpm test:submission', status: 'passed', exitCode: 1, testsExecuted: 1 },
    { command: 'pnpm test:submission', status: 'passed', exitCode: 0, testsExecuted: 0 },
    { command: 'pnpm test:submission', status: 'failed', exitCode: 0 },
    { command: 'pnpm test:submission', status: 'skipped', exitCode: null },
    { command: 'pnpm test:submission', status: 'invented', exitCode: 0 },
  ])('rejects contradictory or empty execution %p', (inputCheck: Record<string, unknown>): void => {
    const inputEvidence: EvidenceInput = createEvidence();
    expect(checkEvidence({ ...inputEvidence, checks: [{ executedAt: '2026-10-26T19:00:00Z', ...inputCheck }] }).length).toBeGreaterThan(0);
  });
  it('rejects missing revision metadata', (): void => {
    expect(checkEvidence({ ...createEvidence(), revision: {} }).length).toBeGreaterThan(0);
  });
});
