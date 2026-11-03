# Actual execution receipts

`submission/evidence.json` records execution, not approval. Never make a skipped or failed check
look passed. Keep replayable inputs and relevant raw output under submission/ and reference them.

The completed receipt has `schemaVersion: 2`, `status: "completed"` and:

- `revision`: `headSha` (40 lowercase hex characters), `isDirty` (boolean) and `diffSha256`
  (the source fingerprint from `pnpm --silent evidence:revision`).
- `checks`: a nonempty array of `command`, `status`, `exitCode`, and optional `testsExecuted`
  and `log` (a retained output path). Record actual positive test counts when tests run.

Passed means exit code 0; failed means an actual nonzero exit code. If a check is unavailable
or skipped, record that status, a null exitCode and a reason. Do not invent execution to satisfy
the structural checker or remove failures from the record. Execution timestamps, if included,
need an explicit timezone. Keep raw logs in `submission/run-output/` as `.txt` or `.json` files;
`.log` files are ignored and will not reach the reviewer by an ordinary commit.

Use the supplied receipt template and provenance command rather than hand-invented hashes.
A later commit containing the receipt does not turn a command run on an earlier dirty tree into
a run on the final SHA. Refresh results after relevant source changes, including the second
packet revision. Bind retained logs to the input and source they actually checked.

The required gate invocation is:

```sh
pnpm exec tsx submission/verify.ts --target submission/gateway.ts
```

The gate must also accept another module path without editing the checker. Its stdout is one
JSON object with `schemaVersion: 2`, `verdict` (`pass` or `fail`), actual `checksExecuted` and a
`failures` array of diagnostic strings. Pass means exit 0 and no failures; fail means exit 1
and useful failure entries. Diagnostics unrelated to this JSON go to stderr. Do not count an
empty or skipped suite as a passing gate. A valid target must be able to pass.

`pnpm verify:submission` checks artifact shape and declared provenance, not semantic correctness,
honest execution or independent human judgment. The hiring team independently replays frozen
sources and tests unfamiliar changes. Do not put private acceptance, answers, scoring, secrets
or personal chats in receipts or logs. Keep your solution and evidence in your private repository.
