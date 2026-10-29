/** Candidate-owned adapter: implement the published stdin/stdout protocol here. */
function reportUnimplementedSubmission(): void {
  process.stderr.write('SUBMISSION_NOT_IMPLEMENTED: complete the candidate-owned advisory decisions before implementing.\n');
  process.exitCode = 2;
}
reportUnimplementedSubmission();
