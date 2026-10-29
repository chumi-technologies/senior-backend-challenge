import { isRecord } from './is-record';
const COMMIT_PATTERN: RegExp = /^[a-f0-9]{40}$/;
const DIGEST_PATTERN: RegExp = /^[a-f0-9]{64}$/;
const CHECK_STATUSES: readonly string[] = ['passed', 'failed', 'skipped', 'unavailable'];
function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
function checkRevision(revision: unknown): readonly string[] {
  if (!isRecord(revision)) return ['Evidence needs revision metadata.'];
  const hasRevision: boolean = typeof revision.headSha === 'string' && COMMIT_PATTERN.test(revision.headSha) && typeof revision.isDirty === 'boolean' && typeof revision.diffSha256 === 'string' && DIGEST_PATTERN.test(revision.diffSha256);
  return hasRevision ? [] : ['Revision needs a commit SHA, dirty indicator, and source fingerprint.'];
}
function checkCommand(check: unknown): readonly string[] {
  if (!isRecord(check) || !hasText(check.command) || !hasText(check.executedAt) || !Number.isFinite(Date.parse(check.executedAt)) || !hasText(check.status) || !CHECK_STATUSES.includes(check.status)) return ['Each check needs a command, timestamp, and explicit status.'];
  if (check.status === 'passed') return check.exitCode === 0 ? [] : ['Passed checks require exitCode 0.'];
  if (check.status === 'failed') return Number.isInteger(check.exitCode) && check.exitCode !== 0 ? [] : ['Failed checks require a nonzero exitCode.'];
  return check.exitCode === null && hasText(check.reason) ? [] : ['Skipped/unavailable checks require null exitCode and a reason.'];
}
function hasExecutedSubmissionTests(checks: readonly unknown[]): boolean {
  return checks.some((check: unknown): boolean => isRecord(check) && check.command === 'pnpm test:submission' && check.status === 'passed' && check.exitCode === 0 && Number.isInteger(check.testsExecuted) && Number(check.testsExecuted) > 0);
}
/** Validate candidate-declared evidence structure; this does not certify its truth. */
export function checkEvidence(evidence: unknown): readonly string[] {
  if (!isRecord(evidence) || evidence.schemaVersion !== 1 || evidence.status !== 'completed' || !Array.isArray(evidence.checks) || evidence.checks.length === 0) return ['Evidence is incomplete: record actual checks using the published template.'];
  const checks: readonly unknown[] = evidence.checks;
  return [...checkRevision(evidence.revision), ...checks.flatMap(checkCommand), ...(hasExecutedSubmissionTests(checks) ? [] : ['Record an executed, passing pnpm test:submission with a positive testsExecuted count.'])];
}
