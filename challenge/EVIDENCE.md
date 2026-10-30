# Candidate evidence format

`submission/evidence.json` is a receipt of actual execution, not an approval token.
Use schemaVersion 1 and status `completed` only after recording work. It contains:

- `revision.headSha`: the commit checked out when you ran the command (40 lowercase hex).
- `revision.isDirty`: whether that execution used local modifications.
- `revision.diffSha256`: the source fingerprint emitted by `pnpm --silent evidence:revision`.
  Despite the legacy field name, this is SHA-256 of sorted Git-visible candidate source paths,
  modes, and bytes, excluding `submission/evidence.json` to avoid self-reference.
- `checks`: a nonempty array of `command`, `executedAt` (timestamp), `status`, and `exitCode`.
  Passed requires exitCode 0; failed requires a nonzero integer. Skipped/unavailable
  requires exitCode null and a nonempty `reason`.
- The `pnpm test:submission` entry must report the actual positive `testsExecuted` count.

Run tests, collect provenance, then write the receipt. Refresh it after source changes.
Head/dirty metadata describes execution time; a later commit of the receipt does not
turn the previous command into a run on the new SHA. The local checker compares the
source fingerprint but cannot establish honest execution or independent human judgment.
The interviewer reads actual output and independently reproduces relevant checks.

Do not claim a skipped check passed. Do not fabricate a receipt to satisfy the schema.
Keep full logs in your private working repository or send them privately to the sender. Never
include secrets, personal chats or interviewer material, and do not publish your solution.
