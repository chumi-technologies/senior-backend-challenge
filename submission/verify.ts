/** Replace this stub with your reusable behavioral gate after the initial decision checkpoint. */
function executeUnimplementedGate(): void {
  process.stdout.write(JSON.stringify({ schemaVersion: 2, verdict: 'fail', checksExecuted: 0, failures: ['NOT_COMPLETED: candidate behavioral gate required'] }) + '\n');
  process.exitCode = 1;
}
executeUnimplementedGate();
