# Changelog

## 1.0.0.4 — 2026-10-29

- Deliver the challenge as a link to a private template repository. Candidates create their own
  private copy, invite the reviewers and receive their scored packet as an `Assign packet` commit.

## 1.0.0.3 — 2026-10-28

- Make the public advisory packet an unscored sample; scored packets are assigned per candidate,
  must turn on run results rather than contract wording, and are pretested against models.
- Add a required 30-minute live follow-up (S4) without AI; it is where independent reasoning is
  observed. Planner behavior is scored by a private acceptance batch set.
- Replace decision-record.md, ai-notes.md and handoff.md with one notes.md; enforce word limits
  on notes/system design and a character limit on judgment fields.
- Pin observation timestamps to one ISO 8601 profile instead of unspecified ISO 8601.

## 1.0.0.2 — 2026-10-26

- Make a private asynchronous GitHub assignment the default; no mandatory live session.
- Add a disclosed unreliable-advice round, candidate-owned decision pause and structured prediction/check/revision trail.
- Require an asynchronous team/system-design artifact while keeping answer labels and acceptance private.
- State explicitly that declarations and passing artifacts do not establish independent human authorship.

## 1.0.0.1 — 2026-10-26

- Replace the broad take-home with a bounded observed human-judgment exercise.
- Define shared agent permissions, externally observed human checkpoints, and an
  explicit deterministic routing protocol without supplying the route implementation.
- Add candidate-owned templates, structural submission checks, tooling tests, and
  secret-free public CI. Keep interviewer operations and acceptance out of this repo.
