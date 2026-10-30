import { readFileSync } from 'node:fs';
const INPUT_DOCUMENT_PATHS: readonly string[] = ['README.md', 'START-HERE.md', 'docs/SUBMISSION.md', 'challenge/SESSION.md', 'AGENTS.md'];
describe('candidate-owned repository instructions', (): void => {
  it('gives one self-service private template path without founder assignment', (): void => {
    const actualGuide: string = readFileSync('START-HERE.md', 'utf8');
    expect(actualGuide).toContain('Use this template');
    expect(actualGuide).toContain('Private');
    expect(actualGuide).toContain('your own GitHub account');
    expect(actualGuide).toContain('No founder-assigned repository');
    expect(actualGuide).toContain('Do not run `git init`');
    expect(actualGuide).toContain('pull request is optional');
  });
  it.each(INPUT_DOCUMENT_PATHS)('does not require the obsolete assigned-repo workflow in %s', (inputPath: string): void => {
    const actualDocument: string = readFileSync(inputPath, 'utf8');
    expect(actualDocument).not.toMatch(/assigned private template-generated repo|verify the source archive|private GitHub thread|this private thread|one private PR|Submit one PR|Open one PR|Initialize the fresh private Git repo/i);
  });
  it('asks for reviewer access and a final commit instead of a mandatory PR', (): void => {
    const actualGuide: string = readFileSync('docs/SUBMISSION.md', 'utf8');
    expect(actualGuide).toContain('collaborator');
    expect(actualGuide).toContain('git rev-parse HEAD');
    expect(actualGuide).toContain('pull request is optional');
    expect(actualGuide).toContain('email or message');
  });
  it('keeps the decision checkpoint and private assessment boundaries', (): void => {
    const actualContract: string = readFileSync('AGENTS.md', 'utf8');
    const actualSession: string = readFileSync('challenge/SESSION.md', 'utf8');
    expect(actualContract).toContain('HUMAN_DECISION_REQUIRED');
    expect(actualContract).toContain('Do not access interviewer material');
    expect(actualSession).toContain('commit your initial decisions');
    expect(actualSession).toContain('AI assistants are not');
  });
});
