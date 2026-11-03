# Asynchronous incident work sample

Use your own private template-generated repository (START-HERE.md). Complete the work
asynchronously; no founder assignment, screen sharing or live stage-release call is needed.
The default total effort cap is **three hours, excluding setup and waiting for the second packet**.
Agree the deadline with the sender. A useful allocation is two hours for initial work, thirty
minutes for the evidence update, and thirty minutes of handoff/verification margin. Stop at the
cap and report unfinished work. Longer trials require separate agreement.

## Work stages

| Stage | Candidate responsibility | Assistant boundary |
| --- | --- | --- |
| Read and frame | Read the contract, incident evidence and both proposed changes. Identify what is observed versus claimed. | Read-only fact collection is allowed. Then stop at HUMAN_DECISION_REQUIRED. |
| Decide | Supply initial hypotheses, predictions, next discriminating check, scope and stop condition. Commit this checkpoint before implementation. | Must not invent the candidate's decisions or approval. |
| Investigate and improve | Authorize assistance, run checks, review both proposals, make one bounded improvement and build a reusable gate. Preserve contradictions and revisions. | Implementation/testing is allowed; material contradictory evidence requires another candidate decision. |
| Initial handoff | Push artifacts, source-bound evidence and limitations. Return the SHA to the sender. | May help prepare the handoff, not claim human independence. |
| Evidence update | Receive a private second packet; decide what changes and what remains justified. Update verification and return a new SHA. | May collect/execute evidence; must pause for revised candidate decisions and any release recommendation. |

The second packet arrives from the original contact as a private attachment or an authorized
`case/update.json` in your private repository. Do not wait for a live interview. If it has not
arrived, send the initial handoff and reserve time; do not invent its contents. Do not publish it.
Its input status does not authorize editing other files outside submission/.

## What the incident asks you to do

The full behavior is in challenge/CONTRACT.md. Investigate a customer's incomplete-response
report despite green headline metrics/CI. Review `proposals/change-a.ts` and `change-b.ts` against
actual evidence. Accept, reject, defer or use a bounded part of a proposal with reasons; adopting
neither can also be justified. A confident review note is not measured behavior.

You have limited time, not a rewrite mandate. Make a justified improvement and leave a gate
that another engineer can run against a different implementation module. It must catch relevant
failures while allowing correct changes. Explain what it does not establish, including which
facts would still be needed before recommending a real release. No real deployment is authorized.

## Team/system design artifact

In submission/system-design.md (at most 500 words), explain how three engineers using coding
agents could use and evolve your gate without routing every judgment through one owner.
Address ownership, independent acceptance, source-bound results, risk-appropriate checks and
customer-outcome evidence. Name one bottleneck to measure, one mechanism you would remove,
one decision retained by a human and one scope you deliberately defer. Tie the proposal to your
actual deliverable and its limits rather than listing additional agents, services or prompts.

## Evidence and independence limits

Keep initial hypotheses/predictions and actual observations separate. Wrong predictions revised
with evidence are useful signal; silently rewriting them is not. Commit order and timestamps
are candidate-declared records, not independent proof of chronology. Use
challenge/JUDGMENT.md and challenge/EVIDENCE.md for the artifact contracts.

The hiring team independently replays frozen submissions and checks unfamiliar later changes.
Private acceptance, answer keys and scoring are not candidate inputs. AGENTS.md is not an AI
detector: neither a pause nor a strong submission proves independent human reasoning. A short
20–30 minute no-AI remote follow-up may be separately arranged for finalists; it is not a live
prerequisite for this asynchronous exercise.
