import { checkSubmissionRecords } from './check-submission-records';
const decision: Readonly<Record<string, unknown>> = { schemaVersion: 2, status: 'completed', actor: 'candidate_declared_unobserved', checkpointSha: 'a'.repeat(40), initial: { hypotheses: ['hypothesis'], predictions: ['prediction'], nextCheck: 'check', scope: 'scope', stopCondition: 'stop' }, final: { decision: 'decision', rationale: 'reason', remainingUnknowns: [] }, revisions: [] };
const evidence: Readonly<Record<string, unknown>> = { schemaVersion: 2, status: 'completed', revision: { headSha: 'a'.repeat(40), isDirty: false, diffSha256: 'b'.repeat(64) }, checks: [{ command: 'tests', status: 'passed', exitCode: 0, testsExecuted: 1 }] };
const input: { readonly decision: unknown; readonly evidence: unknown; readonly update: unknown; readonly notes: string; readonly design: string } = { decision, evidence, update: { schemaVersion: 2, status: 'not_required' }, notes: 'A handoff.', design: 'A design.' };
describe('submission declarations, not correctness', (): void => {
  it('accepts complete declarations without claiming verified human authorship', (): void => {
    expect(checkSubmissionRecords(input)).toEqual([]);
  });
  it('rejects empty initial decisions and fabricated human verification labels', (): void => {
    expect(checkSubmissionRecords({ ...input, decision: { ...decision, actor: 'human_verified' } })).toContain('Incomplete candidate decision record');
    expect(checkSubmissionRecords({ ...input, decision: { ...decision, initial: {} } })).toContain('Incomplete candidate decision record');
  });
  it('records failures and unavailability honestly', (): void => {
    const checks: readonly unknown[] = [...evidence.checks as readonly unknown[], { command: 'control', status: 'failed', exitCode: 1 }, { command: 'unavailable', status: 'unavailable', exitCode: null, reason: 'missing tool' }];
    expect(checkSubmissionRecords({ ...input, evidence: { ...evidence, checks } })).toEqual([]);
  });
  it('rejects zero executed checks or contradictory pass status', (): void => {
    expect(checkSubmissionRecords({ ...input, evidence: { ...evidence, checks: [] } })).toContain('Incomplete execution receipt');
    expect(checkSubmissionRecords({ ...input, evidence: { ...evidence, checks: [{ command: 'x', status: 'passed', exitCode: 1, testsExecuted: 1 }] } })).toContain('Incomplete execution receipt');
  });
  it('requires a complete update only when the packet is received', (): void => {
    expect(checkSubmissionRecords({ ...input, update: { schemaVersion: 2, status: 'completed' } })).toContain('Invalid evidence-update record');
    expect(checkSubmissionRecords({ ...input, update: { schemaVersion: 2, actor: 'candidate_declared_unobserved', status: 'completed', packetId: 'p', previousBelief: 'old', newEvidence: 'new', decision: 'revise', rationale: 'why', verification: 'command' } })).toEqual([]);
  });
  it('counts words without making table padding part of the budget', (): void => {
    expect(checkSubmissionRecords({ ...input, design: '| Field | Value |\n| --- | --- |\n| Source | SHA |' })).toEqual([]);
    expect(checkSubmissionRecords({ ...input, notes: 'word '.repeat(601) })).toContain('Notes must be complete and at most 600 words');
    expect(checkSubmissionRecords({ ...input, design: 'NOT_COMPLETED' })).toContain('Design must be complete and at most 500 words');
  });
});
