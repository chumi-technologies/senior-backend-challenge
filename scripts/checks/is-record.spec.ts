import { isRecord } from './is-record';
describe('parsed JSON object narrowing', (): void => {
  it.each([null, [], 'text', 4, false])('rejects non-object %p', (inputValue: unknown): void => {
    expect(isRecord(inputValue)).toBe(false);
  });
  it('accepts an object', (): void => {
    expect(isRecord({ value: 1 })).toBe(true);
  });
});
