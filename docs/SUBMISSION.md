# Submit from your own GitHub repository

The link you received is the public starter. You create the working repository yourself;
the founder does not need to assign one. Follow [START-HERE.md](../START-HERE.md):
**Use this template → Create a new repository → your own account → Private**, then clone it
normally. Do not run `git init` or replace the clone's history.

## Work and submit

1. Read AGENTS.md, agree the effort cap/deadline with the sender, and run the README setup checks.
2. Run `pnpm --silent challenge:advisory`. Personally supply your initial decisions and
   predictions, then commit that checkpoint before implementation.
3. Continue asynchronously after explicitly deciding the route. Preserve corrections, real
   check results and source provenance. You do not wait for interviewer release between stages.
   Protected-file, dependency or acceptance changes still need written hiring-team permission
   **before** editing; ask the sender by email or message.
4. Complete the required artifacts under `submission/`, including replay commands and handoff
   in notes.md. Commit and push your work to your own private repository. You may use its default
   branch; a separate branch or pull request is optional, not a submission requirement.
5. Invite the reviewer GitHub account named by the sender as a **collaborator** on your private
   repository (Settings → Collaborators). Send the repository link and final commit SHA to the
   sender, along with the initial checkpoint SHA, elapsed work and any unfinished items. If you
   used a branch or PR, include its link too. Do not open PRs or issues on the public starter.

Get the final SHA after committing:

```sh
git rev-parse HEAD
```

Keep the repository private. Never send credentials, personal chats, interviewer answers,
hidden acceptance or scoring material. You are not expected to have any interviewer material.

## Already started?

Do not redo your work. If it is already in your own private repository, continue there. If you
cloned the public starter, create an empty private repository under your account, change the
clone's `origin` to that repository, then push your existing branch. Keep `.git`, your checkpoint
and all subsequent commits intact; no archive download or history reset is required. Never push
your solution to the starter. Ask the sender if you need the reviewer account.

## What happens next

The hiring team reads your submission at the final SHA, independently runs its private acceptance
batches, and schedules the required 30-minute S4 live follow-up. Clarifications use the existing
email or message conversation. No separate GitHub discussion is needed. Stop at the agreed
effort cap and report unfinished work; local checks, commit order and timestamps are not a hiring
decision or proof of AI-free reasoning.
