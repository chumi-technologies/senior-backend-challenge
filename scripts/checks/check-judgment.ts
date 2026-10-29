import type { AdvisoryPacket } from './advisory-packet';
import { isRecord } from './is-record';
const TIMESTAMP_PATTERN: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const DECISION_VALUES: readonly string[] = ['accept', 'reject', 'defer'];
const REQUIRED_TEXT_FIELDS: readonly string[] = ['source', 'prediction', 'command', 'observation', 'reason', 'reversalCondition'];
/** Concise fields are reviewable; repeated disclaimers are not evidence. */
export const MAX_FIELD_CHARACTERS: number = 400;
function hasDeclaredDecision(value: unknown): boolean {
  return typeof value === 'string' && DECISION_VALUES.includes(value);
}
function hasOrderedTimestamps(decision: Record<string, unknown>): boolean {
  if (typeof decision.predictedAt !== 'string' || typeof decision.observedAt !== 'string' || !TIMESTAMP_PATTERN.test(decision.predictedAt) || !TIMESTAMP_PATTERN.test(decision.observedAt)) return false;
  const predictedTime: number = Date.parse(decision.predictedAt);
  const observedTime: number = Date.parse(decision.observedAt);
  return Number.isFinite(predictedTime) && Number.isFinite(observedTime) && predictedTime <= observedTime;
}
function checkDecision(value: unknown): readonly string[] {
  if (!isRecord(value)) return ['Each judgment decision must be an object.'];
  const hasText: boolean = REQUIRED_TEXT_FIELDS.every((field: string): boolean => typeof value[field] === 'string' && String(value[field]).trim().length > 0);
  const tooLong: readonly string[] = REQUIRED_TEXT_FIELDS.filter((field: string): boolean => typeof value[field] === 'string' && String(value[field]).length > MAX_FIELD_CHARACTERS);
  if (tooLong.length > 0) return [`Decision ${String(value.proposalId)} fields exceed ${MAX_FIELD_CHARACTERS} characters: ${tooLong.join(', ')}.`];
  const hasDecisions: boolean = hasDeclaredDecision(value.initialDecision) && hasDeclaredDecision(value.finalDecision);
  return hasText && hasDecisions && hasOrderedTimestamps(value) ? [] : [`Decision ${String(value.proposalId)} needs source, initial/final decision, prediction before observation, actual check, reason and reversal condition.`];
}
/** Validate declared artifact completeness only; never infer correct answers or human authorship. */
export function checkJudgment(judgment: unknown, packet: AdvisoryPacket): readonly string[] {
  if (!isRecord(judgment) || judgment.schemaVersion !== 1 || judgment.packetId !== packet.packetId || judgment.status !== 'completed' || judgment.authorship !== 'candidate_declared_unobserved' || !Array.isArray(judgment.decisions)) return ['Complete submission/judgment.json as a candidate-declared, unobserved decision trail.'];
  const decisions: readonly unknown[] = judgment.decisions;
  const identifiers: readonly unknown[] = decisions.map((decision: unknown): unknown => isRecord(decision) ? decision.proposalId : undefined);
  const expected: readonly string[] = packet.proposalIds;
  const hasCoverage: boolean = identifiers.length === expected.length && new Set(identifiers).size === expected.length && expected.every((identifier: string): boolean => identifiers.includes(identifier));
  return [...(hasCoverage ? [] : ['Judgment must cover each advisory proposal exactly once, without extra IDs.']), ...decisions.flatMap(checkDecision)];
}
