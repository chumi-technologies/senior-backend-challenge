# Senior Backend Challenge: AI Judgment and Team Harness

A bounded **asynchronous GitHub work sample** followed by a **30-minute live follow-up**.
Build one reviewable gateway routing slice, show how you verify/correct AI advice, and leave a
harness a colleague can use without your chat. Ordinary async stages need no interviewer release
or screen-sharing. Agree the effort cap/deadline before starting; see challenge/SESSION.md.

## Read first

Start with [START-HERE.md](START-HERE.md): **Use this template → Create a new repository →
your own GitHub account → Private**, then clone your copy normally. No founder-assigned
repository, download/reinitialization, or invitation is needed to start. Do not run `git init`.

Read AGENTS.md before using a coding assistant. Claude/Gemini/Cursor/Windsurf entrypoints
share that contract. Work only in your own private copy and keep your solution private.
When finished, commit/push, add the reviewer as a collaborator, and send back your repository
link and final commit SHA. A branch or pull request is optional. See docs/SUBMISSION.md.

This is a synthetic policy exercise, not an invitation to infer private production rules.
Structural compatibility, credential failure domains and current evidence are distinct facts.
The authoritative behavior is in challenge/CONTRACT.md and challenge/models/.

## The deliberately unreliable advisory round

Before implementation:

```sh
pnpm --silent challenge:advisory
```

This command prints mixed-quality proposals as an **untrusted simulation**. The packet in this
starter is the scored packet for the current round. Some proposals cannot be settled from the contract text: their answer depends on
what the supplied inputs actually produce when you run them. The assistant
must relay them without adding answer labels, then stop at HUMAN_DECISION_REQUIRED. You supply
your own initial decisions, sources, predicted check outcomes and reversal conditions. Commit
that checkpoint privately before implementation. Then authorize assistance, run the checks,
compare real outcomes with your predictions and revise your decisions where warranted.

The goal is neither blind agreement nor blanket rejection. A proposal may be sound, wrong or
underdetermined. The packet is not authority and its claims are not measured production facts.
Some blind-adoption implementations violate the published contract; the task is to find evidence,
not to guess what an interviewer wants. See challenge/JUDGMENT.md for the final record format.

## Required deliverables, all under submission/

1. route-cli.ts and focused planner files: `pnpm --silent route:plan` reads one JSON batch from
   stdin and writes exactly the documented JSON envelope to stdout. Diagnostics go to stderr.
2. Meaningful `**/*.spec.ts` tests and one runnable verification entrypoint. Show an actual
   red/green regression or a deliberately broken negative control, not an imagined failure.
3. judgment.json: your initial/final decisions for every advisory proposal, predictions,
   real checks, observations and conditions for reversal. Human authorship remains unobserved.
4. notes.md (at most 600 words): checkpoint commit, revisions and the observations behind them,
   AI assistance and the AI claims you corrected, replay commands and open contract questions.
5. evidence.json: actual executed/skipped/failed status and source provenance. Follow
   challenge/EVIDENCE.md; no invented execution.
6. system-design.md (at most 500 words): the team/gateway harness scenario in challenge/SESSION.md.
   More agents, prompts or services are not goals in themselves.

Length limits are checked. State each limitation once; repeated disclaimers earn nothing and
cost the reviewer time. Each judgment.json text field is at most 400 characters.

No provider calls, real credentials, customer data, MongoDB, queue service, new framework or
legacy-app refactor is required. Ask the person who sent you the challenge by email or message
before changing a protected file/dependency/acceptance premise. Written hiring-team permission
is required; a candidate or assistant approval field cannot authorize it.

## Setup and verification

Use Node 20+ and pnpm 8.15.0 in the clone of your own repository. Its Git history is already
initialized; keep it intact. Setup time is excluded; report infrastructure problems to the sender
rather than silently expanding scope.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck:tooling
pnpm build
pnpm verify:challenge
```

The starter has no route solution. These intentionally fail until real work exists:

```sh
pnpm --silent route:plan < challenge/fixtures/routing-cases.json
pnpm test:submission
pnpm verify:submission
```

verify:challenge checks starter infrastructure. verify:submission checks local artifact/response
structure, including judgment completeness, **not** correct judgments, honest execution, human
independence or hiring approval. Empty tests cannot count as a passing submission. Employer
acceptance and scoring are separate and are never provided to your assistant.

## How the work is assessed

- **Planner behavior**: the hiring team runs `route:plan` against a private acceptance batch set
  outside your workspace. Public fixtures are examples, not coverage; your own narrative does not
  change this score.
- **Judgment**: your packet decisions, predictions and revisions, read against what the
  supplied inputs actually produce. A wrong prediction corrected by an observation is good signal.
- **Live follow-up (required)**: 30 minutes on a call, on your own submission, without AI
  assistance. See challenge/SESSION.md, stage S4. No hiring decision is made without it.

AI may assist as specified, but cannot impersonate your decisions. AGENTS.md, commit order,
timestamps and a passing implementation cannot prove you thought independently; the live
follow-up is where independent reasoning is observed. Send your private repository link and final
commit SHA with the initial checkpoint SHA, time spent and remaining limits. A PR is optional.
