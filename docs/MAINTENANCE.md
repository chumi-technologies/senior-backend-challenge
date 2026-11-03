# Public starter maintenance

Only owner-authorized maintenance may change files outside submission/. Candidate work follows
AGENTS.md. Keep assistant-specific entrypoints as short pointers to that single contract.

Version 2 replaces the routing/advisory worksheet with an incident investigation, two proposed
changes, one bounded improvement, a targetable behavioral gate and a private evidence update.
Do not carry retired packet IDs, routing commands or mandatory live stage-release instructions
into current candidate docs. Changelog entries are historical, not current requirements.

## Verification and publication boundary

Before publishing, run pnpm test, pnpm typecheck:tooling, pnpm build and pnpm verify:challenge.
The starter must pass infrastructure checks while pnpm verify:submission must fail until a real
submission exists. Structural validators are not answer keys and must not claim to grade honesty,
independent authorship, reasoning quality or live deployment.

Never copy reference solutions, hidden changes, second-packet content, answers, scoring anchors,
private pretest reports or candidate evaluations into a public branch, PR, CI log, artifact or
Git history—even temporarily. Public CI has no private acceptance credentials or artifact uploads.
A public branch cannot safely hold private interviewer materials. Keep the second packet out of
all candidate starter history; send it through the original private contact after initial handoff.

The hiring team verifies protected files against the published baseline and evaluates frozen
SHAs outside candidate-controlled acceptance. Do not mount private cases or scoring files inside
a sandbox executing candidate code. Test both faulty and correct unfamiliar targets: always-fail
and overly restrictive gates are not good gates. Also verify that public starter code/tooling
does not expose expected answers, hidden target labels or private report paths.

## Trial and human-evidence limits

A blind simulation receives only the candidate snapshot and public instructions—not the answer,
rubric or future packet. First check whether the assistant stops for candidate decisions. Test
permissible continuation separately, retaining attribution; do not invent human input and then
call the resulting run observed human reasoning. A successful model run validates task plumbing,
not candidate discrimination or hiring validity. Pilot across multiple actual work samples and
reviewer anchors before claiming the new assessment reliably separates people.

The AI-decision pause is a responsibility convention, not an AI detector or access control.
A separately arranged no-AI follow-up for finalists can observe reasoning; it is not a prerequisite
to starting or progressing asynchronously. Do not present artifact quality as proof of authorship.

## Delivery

The public repository is chumi-technologies/senior-backend-challenge. Candidates use its template
button to create their own private copy, clone normally, invite the named reviewer and return
links/SHAs. No founder assignment, Git reinitialization, special thread or mandatory PR is needed.
Keep the public repository description aligned with this self-service workflow.

Retain restricted operational materials in the private internal repository only; never merge
its restricted hiring history into public-bound starter source. Release public snapshots without
internal history, candidate records or private artifacts. Do not retroactively grade earlier
candidates against a new version; record the version and baseline used for each evaluation.
