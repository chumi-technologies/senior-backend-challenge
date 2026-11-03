# Candidate-owned incident decisions

Before implementation, an assistant may inspect the contract and supplied materials, collect
source facts and identify missing evidence. It must then stop at **HUMAN_DECISION_REQUIRED**.
Supply your own initial reasoning; do not ask the assistant to invent your decisions.

Record these in `submission/decision.json` before the proposed discriminating check:

- Competing hypotheses and the evidence currently supporting or limiting them.
- Predicted observations if those explanations are right or wrong.
- The next check that best distinguishes the explanations, and why.
- Bounded work scope, what you will not do, and a stop/escalation condition.

Commit that initial checkpoint privately, then authorize assistance. Preserve it when adding
final decisions and revisions. Record actual commands, inputs, outputs and their limitations
rather than replacing a wrong prediction with what you learned afterwards. Do not backdate.
The final declaration uses:

- `schemaVersion: 2`, `status: "completed"`, `actor: "candidate_declared_unobserved"`.
- `checkpointSha`: the initial decision commit's full 40-character SHA (empty before that commit).
- `initial`: `hypotheses` and `predictions` as string arrays; `nextCheck`, `scope` and
  `stopCondition` as strings supplied by you.
- `final`: `decision` and `rationale` as strings; `remainingUnknowns` as a string array (empty is allowed).
- `revisions`: an array of `{evidence, previousBelief, revisedBelief, consequence}` string fields.

The supplied template starts with `status: "not_completed"`; do not mark it completed before
real work exists. Never use `human_verified` for actor. You may add relevant supporting fields.

Review **both** proposed changes. For each, record accept/reject/defer (or the precise part you
would use), your supporting evidence, remaining uncertainty and an observation that would
change your position. A check may be a reproducible counterexample or source/data inspection;
not every hypothesis requires a new implementation. Correct suggestions must not be rejected
merely to look critical. Ask for specification clarification when the evidence cannot settle it.

When material evidence contradicts a prediction, the assistant reports it and pauses the
affected action. You decide whether to revise, investigate or defer. The assistant may transcribe
what you supply, but must not impersonate that decision. Record who actually identified each
substantive error, including when it was AI. The final release recommendation also belongs to
you; a local pass does not prove a customer-serving deployment.

## Second packet

Before receiving a packet, the template `submission/update.json` may remain `not_required`.
After the sender supplies it, use `schemaVersion: 2`, `status: "completed"` and these nonempty
string fields: `packetId`, `previousBelief`, `newEvidence`, `decision`, `rationale`, `verification`.
Reference the initial handoff SHA, state which judgments change or remain justified and why,
predict the next check before running it, then record actual observations and your disposition.
The same actor remains `candidate_declared_unobserved`; no human-only observation is implied.
Keep updated raw output under `submission/run-output/` using `.txt` or `.json`, not ignored
`.log` files. Do not invent the packet, erase the earlier decision or claim a new run on an old
receipt. Stop at the total cap and state unresolved work.

## Limits

The structural checker does not execute your command strings or establish their truth,
chronology, independent authorship or hiring approval. Submitted declarations and artifact
completeness are evidence to investigate, not a substitute for independent behavior checks.
