import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectSourceRevision } from './collect-source-revision';
let repositoryRoot: string;
function executeGit(argumentsList: readonly string[]): void {
  execFileSync('git', [...argumentsList], { cwd: repositoryRoot, stdio: 'pipe' });
}
beforeEach((): void => {
  repositoryRoot = mkdtempSync(join(tmpdir(), 'challenge-revision-'));
  executeGit(['init', '-q']);
  executeGit(['config', 'user.name', 'Tooling Test']);
  executeGit(['config', 'user.email', 'tooling@example.invalid']);
  mkdirSync(join(repositoryRoot, 'submission'));
  writeFileSync(join(repositoryRoot, 'submission/source.ts'), 'const value: number = 1;\n');
  executeGit(['add', 'submission/source.ts']);
  executeGit(['commit', '-qm', 'test baseline']);
});
afterEach((): void => rmSync(repositoryRoot, { recursive: true, force: true }));
describe('submission source provenance', (): void => {
  it('supports a normal clone of a candidate-owned snapshot without reinitialization or a PR', (): void => {
    const inputCloneRoot: string = join(repositoryRoot, 'candidate-copy');
    const expectedHeadSha: string = collectSourceRevision(repositoryRoot).headSha;
    execFileSync('git', ['clone', '--quiet', '--no-local', repositoryRoot, inputCloneRoot], { stdio: 'pipe' });
    const actualClonedRevision: ReturnType<typeof collectSourceRevision> = collectSourceRevision(inputCloneRoot);
    expect(actualClonedRevision.headSha).toBe(expectedHeadSha);
    expect(actualClonedRevision.isDirty).toBe(false);
    writeFileSync(join(inputCloneRoot, 'submission/source.ts'), 'const value: number = 2;\n');
    const actualWorkingRevision: ReturnType<typeof collectSourceRevision> = collectSourceRevision(inputCloneRoot);
    expect(actualWorkingRevision.headSha).toBe(expectedHeadSha);
    expect(actualWorkingRevision.isDirty).toBe(true);
    expect(actualWorkingRevision.diffSha256).not.toBe(actualClonedRevision.diffSha256);
  });
  it('records clean commit and changes the fingerprint when source changes', (): void => {
    const actualBefore: ReturnType<typeof collectSourceRevision> = collectSourceRevision(repositoryRoot);
    writeFileSync(join(repositoryRoot, 'submission/source.ts'), 'const value: number = 2;\n');
    const actualAfter: ReturnType<typeof collectSourceRevision> = collectSourceRevision(repositoryRoot);
    expect(actualBefore.isDirty).toBe(false);
    expect(actualAfter.isDirty).toBe(true);
    expect(actualAfter.headSha).toBe(actualBefore.headSha);
    expect(actualAfter.diffSha256).not.toBe(actualBefore.diffSha256);
  });
  it('excludes the self-referential receipt but includes new source files', (): void => {
    const inputBefore: string = collectSourceRevision(repositoryRoot).diffSha256;
    writeFileSync(join(repositoryRoot, 'submission/evidence.json'), '{}');
    expect(collectSourceRevision(repositoryRoot).diffSha256).toBe(inputBefore);
    writeFileSync(join(repositoryRoot, 'submission/new-source.ts'), 'export const value: number = 3;\n');
    expect(collectSourceRevision(repositoryRoot).diffSha256).not.toBe(inputBefore);
  });
  it('detects deletion and executable-mode changes', (): void => {
    const inputBefore: string = collectSourceRevision(repositoryRoot).diffSha256;
    chmodSync(join(repositoryRoot, 'submission/source.ts'), 0o755);
    expect(collectSourceRevision(repositoryRoot).diffSha256).not.toBe(inputBefore);
    rmSync(join(repositoryRoot, 'submission/source.ts'));
    expect(collectSourceRevision(repositoryRoot).diffSha256).not.toBe(inputBefore);
  });
  it('rejects symlink source instead of reading outside the submission', (): void => {
    symlinkSync(join(repositoryRoot, '.git/config'), join(repositoryRoot, 'submission/link.ts'));
    expect((): void => { collectSourceRevision(repositoryRoot); }).toThrow('regular files');
  });
});
