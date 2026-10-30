# Public starter maintenance

This repository intentionally contains the task contract and tooling, not its solution.
Only owner-authorized maintenance may change files outside `submission/`. Candidate
work follows AGENTS.md instead. Keep agent-specific entrypoints as pointers to that
single contract. Do not copy scoring anchors, hidden packets, solutions, or acceptance
reports into a public branch, PR, CI log, artifact, or git history, even temporarily.

Run `pnpm test`, `pnpm build`, and `pnpm verify:challenge` before publishing. The starter
must pass those checks, while `pnpm verify:submission` must fail until real candidate
artifacts and an implementation exist. This distinction is intentional. Public CI has
no private acceptance credentials, cases, repository checkout, or artifact uploads.

Structural tooling is not a trust root against a candidate changing their checkout.
The interviewer independently verifies protected files against the supplied baseline
and runs acceptance outside the candidate workspace. Never mount private acceptance
material in a sandbox that executes candidate code. The async advisory decision pause
is a candidate responsibility, not observed human independence. Only the hiring team
can authorize protected-file/acceptance exceptions through the existing email/message contact.
The public advisory simulation contains claims only, never private classifications.

## Scored packets, pretest and acceptance (private)

The starter publishes one scored packet per hiring round in challenge/advisory-packet.json
(`scored: true`) with its data files in `challenge/fixtures/` and `ops/`. The earlier sample
`public-sample-v1` was settled by contract sentences alone and must never be scored. Answer keys,
classifications and pretest records stay in restricted storage. The packet is public, so rotate
it for each round, and sooner if solutions to it appear publicly.

- At most one proposal per packet may be decidable from the contract text alone (a control).
  Every other proposal must turn on what the candidate's own planner or a supplied private
  fixture produces when run: vary thresholds, timestamps and catalogs per round.
- Before publishing a packet, run a wording-only pretest: give the contract plus the packet claims,
  without the HUMAN_DECISION_REQUIRED line or any supplied file, to one frontier and one small
  model in fresh runs. Replace any non-control proposal a model settles correctly without
  guessing. Record the runs privately with the packet.
- Do not expect a packet to stop AI. With the supplied files in the prompt, current models solved
  the data-dependent proposals from text alone (measured 2026-10-28), and a model that runs code
  always will. Rotating packets limits how far answers carry between rounds and gives S4
  material; S4 is where judgment is observed.
- The private acceptance batch set covers every contract sentence, including inputs absent from
  the public fixtures. Run it outside the candidate workspace against the frozen SHA; planner
  scores come from it, not from the candidate's narrative.
- S4 uses a short private script: one behavior change to request, one unseen proposal, one
  question about the candidate's own submission. Keep it out of every public branch.

## Repositories and delivery

- `chumi-technologies/senior-backend-challenge-internal` (private, never shared): `main` is the
  starter source and its PR history; the orphan branch `hiring` holds the restricted material
  (reference planner, acceptance batches, packet generator, answer keys, pretest records, S4).
  Never merge, cherry-pick or diff `hiring` into `main`; the public-boundary check flags
  answer-key paths if that happens. Its history before 2026-10-28 was public: 13 public forks
  keep earlier starters and the sample packet, none holds restricted material.
- `chumi-technologies/senior-backend-challenge` (public template): one snapshot commit per
  released starter, published from internal `main` by `hiring`'s `issue/publish-starter.mjs`.
  No PRs, issues or other branches live there. Nothing restricted may ever be pushed to it.

Per candidate: send only the public template link and the reviewer GitHub account. The candidate
creates a private copy under their own account with Use this template, clones it normally, and
sends back its link and final SHA after inviting the reviewer. No founder assignment, archive
verification, Git reinitialization, special thread or mandatory candidate PR is needed. Publish
no candidate solutions. Keep the public repository description consistent with self-service access.
New round: generate a packet on `hiring`,
pretest it, copy its files into internal `main` by PR, then publish the starter.
