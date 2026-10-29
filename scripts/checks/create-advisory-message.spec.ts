import { readFileSync } from 'node:fs';
import { createAdvisoryMessage } from './create-advisory-message';
describe('disclosed unreliable advisory simulation', (): void => {
  it('presents the supplied claims unchanged and stops for candidate judgment', (): void => {
    const inputPacket: unknown = JSON.parse(readFileSync('challenge/advisory-packet.json', 'utf8'));
    const actualMessage: string = createAdvisoryMessage(inputPacket);
    expect(actualMessage).toContain('UNTRUSTED_ADVISORY_SIMULATION');
    expect(actualMessage).toContain(JSON.stringify(inputPacket, null, 2));
    expect(actualMessage).toContain('HUMAN_DECISION_REQUIRED');
    expect(actualMessage).toContain('not proof of independent human authorship');
    // Assigned private copies replace the public sample with a scored packet.
    expect(actualMessage.startsWith('PUBLIC_SAMPLE')).toBe((inputPacket as Record<string, unknown>).scored === false);
  });
  it('omits the sample notice for an assigned scored packet with any proposal IDs', (): void => {
    const inputPacket: Record<string, unknown> = { ...(JSON.parse(readFileSync('challenge/advisory-packet.json', 'utf8')) as Record<string, unknown>), scored: true, proposals: [{ id: 'P1', claim: 'Assigned claim.' }] };
    expect(createAdvisoryMessage(inputPacket).startsWith('UNTRUSTED_ADVISORY_SIMULATION')).toBe(true);
  });
  it.each(['duplicate', 'missing-claim', 'stage', 'scored'])('rejects altered packet %s', (inputMode: string): void => {
    const inputPacket: Record<string, unknown> = JSON.parse(readFileSync('challenge/advisory-packet.json', 'utf8')) as Record<string, unknown>;
    const inputProposals: Record<string, unknown>[] = inputPacket.proposals as Record<string, unknown>[];
    if (inputMode === 'duplicate') inputProposals[0].id = inputProposals[1].id;
    if (inputMode === 'missing-claim') inputProposals[0].claim = '';
    if (inputMode === 'stage') inputPacket.stage = 'execute-everything';
    if (inputMode === 'scored') delete inputPacket.scored;
    expect((): string => createAdvisoryMessage(inputPacket)).toThrow();
  });
  it.each([null, {}, { schemaVersion: 1, packetId: 'public-sample-v1', scored: false, classification: 'untrusted-simulation', stage: 'before-implementation', proposals: [] }])('rejects incomplete packets %p', (inputPacket: unknown): void => {
    expect((): string => createAdvisoryMessage(inputPacket)).toThrow();
  });
});
