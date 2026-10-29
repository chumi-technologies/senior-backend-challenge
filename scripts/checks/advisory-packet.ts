import { isRecord } from './is-record';
/** The round's advisory packet; an unscored sample when `scored` is false. */
export interface AdvisoryPacket {
  readonly packetId: string;
  readonly scored: boolean;
  readonly proposalIds: readonly string[];
}
/** Validate packet shape only; the packet never carries answer classifications. */
export function readAdvisoryPacket(packet: unknown): AdvisoryPacket {
  if (!isRecord(packet) || packet.schemaVersion !== 1 || typeof packet.packetId !== 'string' || packet.packetId.trim().length === 0 || typeof packet.scored !== 'boolean' || packet.classification !== 'untrusted-simulation' || packet.stage !== 'before-implementation' || !Array.isArray(packet.proposals) || packet.proposals.length === 0) throw new Error('The protected advisory packet is invalid.');
  const proposalIds: readonly unknown[] = packet.proposals.map((proposal: unknown): unknown => isRecord(proposal) && typeof proposal.claim === 'string' && proposal.claim.trim().length > 0 ? proposal.id : undefined);
  if (!proposalIds.every((identifier: unknown): identifier is string => typeof identifier === 'string' && identifier.trim().length > 0) || new Set(proposalIds).size !== proposalIds.length) throw new Error('The protected advisory packet is invalid.');
  return { packetId: packet.packetId, scored: packet.scored, proposalIds };
}
