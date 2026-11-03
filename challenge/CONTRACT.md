# Gateway incident contract — version 2

This contract describes a synthetic offline stream reconciler, not production billing policy.
Implementation and review claims are not authority. A specification objection belongs in
submission/decision.json with a counterexample and a proposed clarification, not a silent edit.

## Scope and interfaces

`pnpm --silent incident:replay --target <module.ts>` reads one UTF-8 JSON batch on stdin.
The target defaults to submission/gateway.ts. A target exports `replayBatch(batch)` using
challenge/models/gateway-batch.ts and gateway-replay.ts. Return one JSON envelope on stdout;
diagnostics belong on stderr. No network, credentials, clock or randomness is needed.
Only submission/ is editable by candidates; inspect the existing code and proposals freely.

## Input guarantees

A batch is `{schemaVersion: 2, traces: [...]}`. Trace request IDs are unique nonempty strings.
Each trace has requestId, tenantId, httpStatus and events. Events are already ordered by unique,
increasing integer sequence. A kind is accepted, chunk, upstream-complete, downstream-complete,
provider-error or client-cancel. An upstream-complete event has a nonnegative safe integer units.
There is at most one upstream-complete per trace. Other kinds have no units. Empty traces are
valid. Inputs satisfy these types. JSON syntax errors must exit nonzero without partial stdout.
HTTP status is transport metadata, not evidence of completed customer delivery.

## Observable behavior

Process each trace in sequence. Start with zero delivered chunks and no upstream completion.
A chunk means one chunk was forwarded downstream; count it until the first terminal event.
An upstream-complete records its units but is NOT terminal and does not establish delivery.
The first of the following closes the trace; ignore every subsequent event, including chunks:

- client-cancel: status cancelled, billedUnits 0.
- provider-error: status interrupted, billedUnits 0.
- downstream-complete: status delivered only if an upstream-complete was previously observed;
  otherwise interrupted. A later upstream-complete cannot repair an already closed response.

If no terminal event exists, status is interrupted. billedUnits equals the recorded upstream
units only for delivered status; otherwise 0. Zero-unit and zero-chunk deliveries are valid.
Keep the number of chunks forwarded before closing even when status is not delivered.
State is isolated per trace and invocation. Never mutate the input.

## Output

Return exactly `{schemaVersion: 2, results: [...]}`. One result for every input request, no
missing/extra/duplicate IDs, in any order. Each result has exactly requestId, status
(delivered/interrupted/cancelled), deliveredChunks (nonnegative integer) and billedUnits
(nonnegative safe integer). Do not remove unsuccessful requests from the denominator.

## Reusable gate interface

`pnpm exec tsx submission/verify.ts --target <module.ts>` runs candidate-owned behavioral
checks against the supplied target, NOT a hard-coded default implementation. It must also work
for a target outside submission/. It emits exactly one JSON object on stdout:
`{schemaVersion:2, verdict:"pass"|"fail", checksExecuted: number, failures: string[]}`.
Exit 0 for pass and 1 for fail; diagnostics go on stderr. A pass requires positive executed
checks and no failures. Support different correct implementations, not a filename/source-text
allow-list. Detect policy failures, not just compilation or a nonzero test count.

The reviewer can run the frozen gate against unseen correct and faulty targets. Blanket
rejection, accepting everything, and checking only the author's implementation are not useful.
No private target names, expected classifications, or grading weights are part of this starter.

## Evidence boundary

The incident packet is synthetic and finite. Existing code, PR descriptions, logs and metrics
can disagree. Decide from reproducible observations and this contract. Local passing checks do
not prove deployed version, provider capacity, billed customer money, or customer recovery.
No real release is requested. Release advice must identify missing evidence and authority.
