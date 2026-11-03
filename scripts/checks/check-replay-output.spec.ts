import { checkReplayOutput } from './check-replay-output';
describe('replay output shape only', (): void => {
  const result: Readonly<Record<string, unknown>> = { requestId: 'r', status: 'delivered', deliveredChunks: 0, billedUnits: 0 };
  it.each(['delivered', 'interrupted', 'cancelled'])('accepts documented status %s', (status: string): void => {
    expect(checkReplayOutput({ schemaVersion: 2, results: [{ ...result, status }] }, ['r'])).toEqual([]);
  });
  it('accepts an empty batch', (): void => {
    expect(checkReplayOutput({ schemaVersion: 2, results: [] }, [])).toEqual([]);
  });
  it.each([null, { schemaVersion: 1, results: [] }, { schemaVersion: 2, results: [], extra: true }])('rejects invalid envelope %j', (output: unknown): void => {
    expect(checkReplayOutput(output, []).length).toBeGreaterThan(0);
  });
  it.each([{ ...result, billedUnits: -1 }, { ...result, status: 'success' }, { ...result, extra: true }, { ...result, deliveredChunks: 0.5 }])('rejects invalid result %j', (output: unknown): void => {
    expect(checkReplayOutput({ schemaVersion: 2, results: [output] }, ['r']).length).toBeGreaterThan(0);
  });
  it('rejects missing, extra and duplicate IDs', (): void => {
    expect(checkReplayOutput({ schemaVersion: 2, results: [] }, ['r']).length).toBeGreaterThan(0);
    expect(checkReplayOutput({ schemaVersion: 2, results: [result] }, ['other']).length).toBeGreaterThan(0);
    expect(checkReplayOutput({ schemaVersion: 2, results: [result, result] }, ['r', 's']).length).toBeGreaterThan(0);
  });
});
