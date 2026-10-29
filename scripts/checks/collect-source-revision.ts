import { createHash, type Hash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync, type Stats } from 'node:fs';
import { join } from 'node:path';
type SourceRevision = { readonly headSha: string; readonly isDirty: boolean; readonly diffSha256: string };
function readGit(root: string, argumentsList: readonly string[]): string {
  return execFileSync('git', [...argumentsList], { cwd: root, encoding: 'utf8' }).trim();
}
function addSourceFile(hash: Hash, root: string, path: string): void {
  const absolutePath: string = join(root, path);
  hash.update(path).update('\0');
  const metadata: Stats | undefined = (() : Stats | undefined => {
    try { return lstatSync(absolutePath); } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') return undefined;
      throw error;
    }
  })();
  if (!metadata) { hash.update('deleted\0'); return; }
  if (!metadata.isFile() || metadata.isSymbolicLink()) throw new Error('Submission source must contain regular files only.');
  hash.update(String(metadata.mode & 0o777)).update('\0').update(readFileSync(absolutePath)).update('\0');
}
/** Fingerprint candidate source without the self-referential evidence receipt. */
export function collectSourceRevision(root: string): SourceRevision {
  const output: string = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', 'submission'], { cwd: root, encoding: 'utf8' });
  const paths: readonly string[] = [...new Set(output.split('\0').filter((path: string): boolean => path.length > 0 && path !== 'submission/evidence.json'))].sort();
  const hash: Hash = createHash('sha256');
  paths.forEach((path: string): void => addSourceFile(hash, root, path));
  return { headSha: readGit(root, ['rev-parse', 'HEAD']), isDirty: readGit(root, ['status', '--porcelain']).length > 0, diffSha256: hash.digest('hex') };
}
