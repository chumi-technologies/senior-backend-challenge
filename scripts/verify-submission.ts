import { verifySubmission } from './checks/verify-submission';
async function executeSubmissionCheck(): Promise<void> {
  const errors: readonly string[] = await verifySubmission(process.cwd());
  errors.forEach((error: string): void => { process.stderr.write(`INCOMPLETE: ${error}\n`); });
  if (errors.length > 0) { process.exitCode = 1; return; }
  process.stdout.write('STRUCTURE_ONLY: artifacts and response schema are valid; independent correctness and human observation are not certified.\n');
}
void executeSubmissionCheck().catch((error: unknown): void => {
  process.stderr.write(`STRUCTURAL_CHECK_FAILED: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
