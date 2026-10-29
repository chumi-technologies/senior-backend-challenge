import { readFile } from 'node:fs/promises';
import { createAdvisoryMessage } from './checks/create-advisory-message';
async function executeAdvisoryPresentation(): Promise<void> {
  const packet: unknown = JSON.parse(await readFile('challenge/advisory-packet.json', 'utf8'));
  process.stdout.write(createAdvisoryMessage(packet));
}
void executeAdvisoryPresentation().catch((error: unknown): void => {
  process.stderr.write(`ADVISORY_PRESENTATION_FAILED: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
