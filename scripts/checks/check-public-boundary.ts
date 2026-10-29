type PublicFile = { readonly path: string; readonly content: string };
const RESTRICTED_PATH: RegExp = /(^|\/)(?:interviewer-kit|hidden-cases|answer-key|reference-solution|scorecard)(?:\/|\.|$)/i;
const PRIVATE_MARKER: string = ['INTERVIEWER', 'ONLY', 'DO', 'NOT', 'PUBLISH'].join('_');
/** Detect obvious private-material accidents, not certify historical confidentiality. */
export function checkPublicBoundary(files: readonly PublicFile[]): readonly string[] {
  return files.flatMap((file: PublicFile): readonly string[] => {
    const errors: string[] = [];
    if (RESTRICTED_PATH.test(file.path)) errors.push(`Restricted material path: ${file.path}`);
    if (file.content.includes(PRIVATE_MARKER)) errors.push(`Restricted material marker in: ${file.path}`);
    if (file.path.startsWith('.github/workflows/') && /secrets\s*(?:\.|\[)|pull_request_target|actions\/upload-artifact/.test(file.content)) errors.push(`Public workflow must not consume secrets, privileged PR triggers, or upload submission artifacts: ${file.path}`);
    return errors;
  });
}
