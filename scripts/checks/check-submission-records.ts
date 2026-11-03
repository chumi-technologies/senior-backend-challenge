import { isRecord } from './is-record';
interface SubmissionRecords { readonly decision: unknown; readonly evidence: unknown; readonly update: unknown; readonly notes: string; readonly design: string }
const SHA_PATTERN: RegExp = /^[a-f0-9]{40}$/;
const FINGERPRINT_PATTERN: RegExp = /^[a-f0-9]{64}$/;
function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
function isTexts(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(isText);
}
function hasDecision(value: unknown): boolean {
  if (!isRecord(value) || value.schemaVersion !== 2 || value.status !== 'completed' || value.actor !== 'candidate_declared_unobserved' || !SHA_PATTERN.test(String(value.checkpointSha))) return false;
  const initial: unknown = value.initial;
  const final: unknown = value.final;
  if (!isRecord(initial) || !isRecord(final) || !Array.isArray(value.revisions)) return false;
  return isTexts(initial.hypotheses) && initial.hypotheses.length > 0 && isTexts(initial.predictions) && initial.predictions.length > 0 && ['nextCheck', 'scope', 'stopCondition'].every((key: string): boolean => isText(initial[key])) && isText(final.decision) && isText(final.rationale) && isTexts(final.remainingUnknowns) && value.revisions.every((revision: unknown): boolean => isRecord(revision) && ['evidence', 'previousBelief', 'revisedBelief', 'consequence'].every((key: string): boolean => isText(revision[key])));
}
function isCheck(value: unknown): boolean {
  if (!isRecord(value) || !isText(value.command)) return false;
  if (value.status === 'skipped' || value.status === 'unavailable') return value.exitCode === null && isText(value.reason);
  return value.status === 'passed' ? value.exitCode === 0 : value.status === 'failed' && Number.isInteger(value.exitCode) && Number(value.exitCode) !== 0;
}
function hasEvidence(value: unknown): boolean {
  if (!isRecord(value) || value.schemaVersion !== 2 || value.status !== 'completed' || !isRecord(value.revision) || !Array.isArray(value.checks) || value.checks.length === 0) return false;
  return SHA_PATTERN.test(String(value.revision.headSha)) && typeof value.revision.isDirty === 'boolean' && FINGERPRINT_PATTERN.test(String(value.revision.diffSha256)) && value.checks.every(isCheck) && value.checks.some((check: unknown): boolean => isRecord(check) && Number.isSafeInteger(check.testsExecuted) && Number(check.testsExecuted) > 0);
}
function hasUpdate(value: unknown): boolean {
  if (!isRecord(value) || value.schemaVersion !== 2) return false;
  if (value.status === 'not_required') return true;
  return value.status === 'completed' && value.actor === 'candidate_declared_unobserved' && ['packetId', 'previousBelief', 'newEvidence', 'decision', 'rationale', 'verification'].every((key: string): boolean => isText(value[key]));
}
function hasDocument(text: string, maximumWords: number): boolean {
  const words: readonly string[] = text.match(/[\p{L}\p{N}][\p{L}\p{N}'_-]*/gu) ?? [];
  return words.length > 0 && words.length <= maximumWords && !text.includes('NOT_COMPLETED');
}
/** Check declarations and bounded handoff documents without grading their reasoning. */
export function checkSubmissionRecords(input: SubmissionRecords): readonly string[] {
  const errors: string[] = [];
  if (!hasDecision(input.decision)) errors.push('Incomplete candidate decision record');
  if (!hasEvidence(input.evidence)) errors.push('Incomplete execution receipt');
  if (!hasUpdate(input.update)) errors.push('Invalid evidence-update record');
  if (!hasDocument(input.notes, 600)) errors.push('Notes must be complete and at most 600 words');
  if (!hasDocument(input.design, 500)) errors.push('Design must be complete and at most 500 words');
  return errors;
}
