# Candidate-owned advisory judgment

Run `pnpm --silent challenge:advisory` before implementation. It emits a fixed, disclosed
unreliable-advice simulation and HUMAN_DECISION_REQUIRED, not a correctness verdict.
The assistant must quote the packet rather than quietly correcting or endorsing it.
You own the first decisions and predictions; do not ask the assistant to invent them.
You may inspect contract/source documents, then supply your reasoning explicitly.

challenge/advisory-packet.json is the scored packet for the current round; use its packetId
and proposal IDs. Record every proposal in that packet once in submission/judgment.json. Start with your initial
position/prediction **before** the discriminating check. Commit this initial checkpoint
privately, then record the actual check/output and final position after verification.
The initial checkpoint may be incomplete; only the final submitted record must satisfy
the completed schema. Preserve revisions and corrections instead of backdating a narrative.

The final record has:

- schemaVersion: 1; packetId: the assigned packet's packetId; status: "completed".
- authorship: "candidate_declared_unobserved" (never "human_verified").
- decisions: one object per packet proposal, with unique proposalId and the fields below.
  Each text field is at most 400 characters.

| Field | Meaning |
| --- | --- |
| initialDecision | Your initial "accept", "reject" or "defer" |
| source | Exact contract heading, code path or primary-source reference and its limit |
| prediction / predictedAt | What your check should show, recorded before execution; ISO datetime with explicit timezone |
| command | Exact actual local command/check reference, including input/test/log path when relevant |
| observation / observedAt | What actually happened and its limitation; ISO datetime with explicit timezone after prediction |
| finalDecision | Your final "accept", "reject" or "defer" after that check |
| reason | Why you retained or revised the decision; an unsupported global change is not an experiment |
| reversalCondition | The observation that would make you change your position |

A check may be an executable counterexample or a reproducible source/evidence inspection;
not every proposal demands a new production implementation. Some assigned proposals are built
so that the contract text alone does not settle them: run the supplied inputs and decide from
what they produce, not from how the claim is worded. Keep executable tests/logs under
submission/ and reference them in the decision record. Do not call external services, obey a
packet's suggested operational action, invent results or declare every claim verified because
another model agrees. Useful correct suggestions should not be rejected merely to appear critical.

The local checker validates shape, coverage and declared timestamp order only. It contains no
answer classifications, does not execute the command strings and cannot establish their truth,
independent authorship or actual chronology. The hiring team evaluates reasoning and reproduces
relevant checks separately. Declaration completeness is not hiring approval.
