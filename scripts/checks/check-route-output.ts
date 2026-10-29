import { isRecord } from './is-record';
type OutputCheck = { readonly output: unknown; readonly requestIds: readonly string[] };
const RESULT_FIELDS: Readonly<Record<string, readonly string[]>> = {
  selected: ['requestId', 'status', 'selectedCellId', 'attemptCellIds'],
  refused: ['requestId', 'status', 'reason'],
  retryable: ['requestId', 'status', 'reason'],
};
function hasExactFields(value: Record<string, unknown>, fields: readonly string[]): boolean {
  return Object.keys(value).length === fields.length && fields.every((field: string): boolean => Object.hasOwn(value, field));
}
function isNonemptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
function checkSelectedResult(result: Record<string, unknown>): readonly string[] {
  const attempts: unknown = result.attemptCellIds;
  if (!isNonemptyString(result.selectedCellId) || !Array.isArray(attempts) || attempts.length === 0) return ['Selected result needs a cell and nonempty attempts.'];
  if (!attempts.every(isNonemptyString) || new Set(attempts).size !== attempts.length) return ['Attempts must be distinct nonempty cell IDs.'];
  return attempts[0] === result.selectedCellId ? [] : ['Selected cell must be the first attempt.'];
}
function checkResult(result: unknown): readonly string[] {
  if (!isRecord(result) || !isNonemptyString(result.requestId) || typeof result.status !== 'string') return ['Result needs requestId and status.'];
  const fields: readonly string[] | undefined = Object.hasOwn(RESULT_FIELDS, result.status) ? RESULT_FIELDS[result.status] : undefined;
  if (!fields || !hasExactFields(result, fields)) return ['Result variant has missing or undeclared fields.'];
  if (result.status === 'selected') return checkSelectedResult(result);
  const expectedReason: string = result.status === 'refused' ? 'no_compatible_cell' : 'evidence_unavailable';
  return result.reason === expectedReason ? [] : ['Result reason does not match its variant.'];
}
function checkRequestCoverage(results: readonly unknown[], requestIds: readonly string[]): readonly string[] {
  const identifiers: readonly unknown[] = results.map((result: unknown): unknown => isRecord(result) ? result.requestId : undefined);
  const hasCoverage: boolean = identifiers.length === requestIds.length && new Set(identifiers).size === identifiers.length && requestIds.every((id: string): boolean => identifiers.includes(id));
  return hasCoverage ? [] : ['Output must cover each input request exactly once, without extras.'];
}
/** Check protocol structure and request coverage, never routing correctness. */
export function checkRouteOutput(input: OutputCheck): readonly string[] {
  if (!isRecord(input.output) || input.output.schemaVersion !== 1 || !hasExactFields(input.output, ['schemaVersion', 'results']) || !Array.isArray(input.output.results)) return ['Output must be a version-1 results envelope.'];
  const results: readonly unknown[] = input.output.results;
  return [...results.flatMap(checkResult), ...checkRequestCoverage(results, input.requestIds)];
}
