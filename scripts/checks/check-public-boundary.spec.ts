import { checkPublicBoundary } from './check-public-boundary';
describe('obvious public publication accidents', (): void => {
  it('allows a candidate-safe contract', (): void => {
    expect(checkPublicBoundary([{ path: 'AGENTS.md', content: 'Read the public contract.' }])).toEqual([]);
  });
  it.each(['answer-key.json', 'docs/scorecard.md', 'hidden-cases/input.json'])('rejects restricted material path %s', (inputPath: string): void => {
    expect(checkPublicBoundary([{ path: inputPath, content: '' }]).length).toBeGreaterThan(0);
  });
  it('rejects the private material marker without embedding it in a public fixture', (): void => {
    const inputMarker: string = ['INTERVIEWER', 'ONLY', 'DO', 'NOT', 'PUBLISH'].join('_');
    expect(checkPublicBoundary([{ path: 'notes.md', content: inputMarker }]).length).toBeGreaterThan(0);
  });
  it.each(['token: ${{ secrets.PRIVATE_TOKEN }}', 'on: pull_request_target', 'uses: actions/upload-artifact@v4'])('rejects privileged or leaking public workflow %s', (inputContent: string): void => {
    expect(checkPublicBoundary([{ path: '.github/workflows/example.yml', content: inputContent }]).length).toBeGreaterThan(0);
  });
});
