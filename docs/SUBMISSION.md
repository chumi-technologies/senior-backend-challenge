# Submit from your own GitHub repository

Follow [START-HERE.md](../START-HERE.md): **Use this template → Create a new repository →
your own account → Private**, then clone normally. No founder-assigned repository is needed.
Do not run `git init` or replace the clone's history. Keep the solution private.

## Initial handoff

1. Read AGENTS.md and agree the deadline with the sender. The default total effort cap is three
   hours excluding setup/waiting for the update. Reserve time for the second packet.
2. After read-only fact collection, supply your own initial decisions and predictions in
   submission/decision.json and commit that checkpoint before implementation.
3. Work asynchronously, preserving contradictions, revisions, commands and source provenance.
   Protected-file/dependency/acceptance changes require hiring-team written permission before
   editing; ask through the existing email/message conversation.
4. Complete the required files in README.md, commit and push to your own private repository.
   A separate branch or PR is optional. Never open solution PRs/issues on the public starter.
5. Invite the reviewer account named by the sender in **Settings → Collaborators**. Send the
   repository link, initial handoff SHA, initial decision checkpoint SHA, elapsed work and
   unfinished items. Include a branch or PR link if you used one.

Get the SHA after committing:

```sh
git rev-parse HEAD
```

## Evidence update and final handoff

The original contact sends the second packet privately, either as an attachment or as an
authorized case/update.json in your private copy. No synchronous stage-release call is required.
If it has not arrived, send the initial handoff and reserve time; do not invent a packet.

Use the remaining budget to record your revisions in submission/update.json and rerun relevant
checks. Preserve the initial handoff commit. Commit/push again and return the **final SHA**,
updated elapsed work and unresolved limits. The packet's input status does not authorize other
protected edits. Stop at the total cap instead of silently extending it.

The hiring team reads frozen revisions, independently checks behavior and unfamiliar later
changes, and may separately arrange a short no-AI remote follow-up for finalists. Artifact
completeness, commit order and timestamps do not prove AI-free reasoning or hiring approval.

## Already started?

Do not discard existing work. If it is in your own private repository, continue there. If you
cloned the public starter, create an empty private repository under your account, change origin
to that repository, and push your existing branch. Keep .git and all checkpoint/correction
commits intact. No archive download or history reset is needed. Ask the sender for the reviewer
account or clarification of which assessment version applies; do not mix versions silently.

Never submit credentials, personal chats, private answer keys or hidden acceptance material.
You are not expected to have interviewer-only material.
