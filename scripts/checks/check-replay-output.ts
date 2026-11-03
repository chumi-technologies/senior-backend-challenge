import { isRecord } from './is-record';
const RESULT_KEYS: readonly string[] = ['billedUnits', 'deliveredChunks', 'requestId', 'status'];
function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return JSON.stringify(Object.keys(value).sort()) === JSON.stringify(keys);
}
function isResult(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value) || !hasExactKeys(value, RESULT_KEYS)) return false;
  return typeof value.requestId === 'string' && ['delivered', 'interrupted', 'cancelled'].includes(String(value.status)) && Number.isSafeInteger(value.deliveredChunks) && Number(value.deliveredChunks) >= 0 && Number.isSafeInteger(value.billedUnits) && Number(value.billedUnits) >= 0;
}
/** Validate envelope/coverage only, not whether a request actually completed. */
export function checkReplayOutput(output: unknown, requestIds: readonly string[]): readonly string[] {
  if (!isRecord(output) || !hasExactKeys(output, ['results', 'schemaVersion']) || output.schemaVersion !== 2 || !Array.isArray(output.results)) return ['Invalid replay envelope'];
  const results: readonly unknown[] = output.results;
  if (!results.every(isResult)) return ['Invalid replay result shape'];
  const actualIds: readonly string[] = results.map((result: Record<string, unknown>): string => String(result.requestId));
  return actualIds.length === requestIds.length && new Set(actualIds).size === actualIds.length && actualIds.every((id: string): boolean => requestIds.includes(id)) ? [] : ['Result coverage mismatch'];
}
