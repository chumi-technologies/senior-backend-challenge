import { checkRouteOutput } from './check-route-output';
describe('route response structure, not route correctness', (): void => {
  it('accepts each documented result variant', (): void => {
    const inputResults: readonly unknown[] = [{ requestId: 'structural-a', status: 'selected', selectedCellId: 'example-cell', attemptCellIds: ['example-cell'] }, { requestId: 'structural-b', status: 'refused', reason: 'no_compatible_cell' }, { requestId: 'structural-c', status: 'retryable', reason: 'evidence_unavailable' }];
    const actualErrors: readonly string[] = checkRouteOutput({ output: { schemaVersion: 1, results: inputResults }, requestIds: ['structural-c', 'structural-b', 'structural-a'] });
    expect(actualErrors).toEqual([]);
  });
  it.each([null, [], { schemaVersion: 2, results: [] }, { schemaVersion: 1, results: [], extra: true }])('rejects an invalid envelope %p', (inputOutput: unknown): void => {
    expect(checkRouteOutput({ output: inputOutput, requestIds: [] }).length).toBeGreaterThan(0);
  });
  it.each([
    { requestId: 'x', status: 'selected', selectedCellId: 'a', attemptCellIds: [] },
    { requestId: 'x', status: 'selected', selectedCellId: 'a', attemptCellIds: ['b'] },
    { requestId: 'x', status: 'selected', selectedCellId: 'a', attemptCellIds: ['a', 'a'] },
    { requestId: 'x', status: 'selected', selectedCellId: 'a', attemptCellIds: ['a', 1] },
    { requestId: 'x', status: 'refused', reason: 'evidence_unavailable' },
    { requestId: 'x', status: 'retryable', reason: 'no_compatible_cell' },
    { requestId: 'x', status: 'refused', reason: 'no_compatible_cell', extra: true },
    { requestId: 'x', status: '__proto__' },
    { requestId: ' ', status: 'refused', reason: 'no_compatible_cell' },
    { requestId: 'x', status: 'selected', selectedCellId: ' ', attemptCellIds: [' '] },
  ])('rejects malformed variants %p', (inputResult: unknown): void => {
    expect(checkRouteOutput({ output: { schemaVersion: 1, results: [inputResult] }, requestIds: ['x'] }).length).toBeGreaterThan(0);
  });
  it.each([{ results: [] }, { results: [{ requestId: 'other', status: 'refused', reason: 'no_compatible_cell' }] }, { results: [{ requestId: 'x', status: 'refused', reason: 'no_compatible_cell' }, { requestId: 'x', status: 'refused', reason: 'no_compatible_cell' }] }])('rejects missing, extra, or duplicated requests %p', (inputCase: { readonly results: readonly unknown[] }): void => {
    expect(checkRouteOutput({ output: { schemaVersion: 1, results: inputCase.results }, requestIds: ['x'] }).length).toBeGreaterThan(0);
  });
});
