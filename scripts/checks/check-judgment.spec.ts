import type { AdvisoryPacket } from './advisory-packet';
import { checkJudgment, MAX_FIELD_CHARACTERS } from './check-judgment';
const inputPacket: AdvisoryPacket = { packetId: 'assigned-sample', scored: true, proposalIds: ['P1', 'P2', 'P3'] };
function createJudgment(): Record<string, unknown> {
  return { schemaVersion: 1, packetId: inputPacket.packetId, status: 'completed', authorship: 'candidate_declared_unobserved', decisions: inputPacket.proposalIds.map((proposalId: string): Record<string, unknown> => ({ proposalId, initialDecision: 'defer', finalDecision: 'defer', source: 'Synthetic structural-control source, not a model answer.', prediction: 'Synthetic predicted observation.', predictedAt: '2026-10-26T19:00:00Z', command: 'Synthetic check reference; not executed by this validator.', observedAt: '2026-10-26T19:01:00Z', observation: 'Synthetic bounded observation.', reason: 'Synthetic structural-control rationale.', reversalCondition: 'Synthetic condition that changes the position.' })) };
}
describe('candidate-declared async judgment structure', (): void => {
  it('accepts complete declarations without endorsing any classification', (): void => {
    expect(checkJudgment(createJudgment(), inputPacket)).toEqual([]);
  });
  it.each([null, {}, { ...createJudgment(), authorship: 'human_verified' }, { ...createJudgment(), status: 'not_completed' }, { ...createJudgment(), packetId: 'other' }])('rejects incomplete or falsely observed declarations %p', (inputJudgment: unknown): void => {
    expect(checkJudgment(inputJudgment, inputPacket).length).toBeGreaterThan(0);
  });
  it.each(['missing', 'duplicate', 'extra'])('rejects %s proposal coverage', (inputMode: string): void => {
    const inputJudgment: Record<string, unknown> = createJudgment();
    const inputDecisions: Record<string, unknown>[] = inputJudgment.decisions as Record<string, unknown>[];
    if (inputMode === 'missing') inputDecisions.pop();
    if (inputMode === 'duplicate') inputDecisions[0].proposalId = inputDecisions[1].proposalId;
    if (inputMode === 'extra') inputDecisions.push({ ...inputDecisions[0], proposalId: 'extra' });
    expect(checkJudgment(inputJudgment, inputPacket).length).toBeGreaterThan(0);
  });
  it.each(['source', 'prediction', 'command', 'observation', 'reason', 'reversalCondition', 'initialDecision', 'finalDecision'])('rejects missing %s', (inputField: string): void => {
    const inputJudgment: Record<string, unknown> = createJudgment();
    const inputDecisions: Record<string, unknown>[] = inputJudgment.decisions as Record<string, unknown>[];
    inputDecisions[0][inputField] = '';
    expect(checkJudgment(inputJudgment, inputPacket).length).toBeGreaterThan(0);
  });
  it.each(['2026-10-26T18:59:00Z', 'invalid', '2026-10-26', '2026-10-26T19:01:00'])('rejects contradictory observation timestamp %s', (inputTimestamp: string): void => {
    const inputJudgment: Record<string, unknown> = createJudgment();
    const inputDecisions: Record<string, unknown>[] = inputJudgment.decisions as Record<string, unknown>[];
    inputDecisions[0].observedAt = inputTimestamp;
    expect(checkJudgment(inputJudgment, inputPacket).length).toBeGreaterThan(0);
  });
  it('takes proposal coverage from the assigned packet, not a fixed list', (): void => {
    expect(checkJudgment(createJudgment(), { ...inputPacket, proposalIds: ['P1', 'P2', 'P4'] }).length).toBeGreaterThan(0);
    expect(checkJudgment(createJudgment(), { ...inputPacket, packetId: 'another-candidate' }).length).toBeGreaterThan(0);
  });
  it('rejects padded fields over the character limit', (): void => {
    const inputJudgment: Record<string, unknown> = createJudgment();
    const inputDecisions: Record<string, unknown>[] = inputJudgment.decisions as Record<string, unknown>[];
    inputDecisions[0].reason = 'x'.repeat(MAX_FIELD_CHARACTERS);
    expect(checkJudgment(inputJudgment, inputPacket)).toEqual([]);
    inputDecisions[0].reason = 'x'.repeat(MAX_FIELD_CHARACTERS + 1);
    expect(checkJudgment(inputJudgment, inputPacket)).toEqual([`Decision P1 fields exceed ${MAX_FIELD_CHARACTERS} characters: reason.`]);
  });
});
