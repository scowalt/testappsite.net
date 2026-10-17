# CI source preparation

## Native Linux routing

The workflow selects `ci_os: linux`, matching the supported Woodpecker 3.19
agent setting `WOODPECKER_AGENT_LABELS=ci_os=linux`. Before merging this change,
the parent must configure and read back that label and actual Linux ARM64
platform on the current agent, then verify the label and Linux AMD64 platform
on its replacement. Include no other OS or unsupported CPU; retain native platform
reporting. This routing label is not a security boundary or hardware attestation.
The original image index supports both targets, without a matrix or emulation.
ARM64 rollout guidance below is historical, not native AMD64 proof. Commands,
pins and status layout stay unchanged; actual AMD64 acceptance is separate.

This is the source-only MC #27 replacement for the single job in
[Comment-free source](.github/workflows/no-comments.yml). Actions remains enabled
until the parent operator completes native proof and cutover. Local checks and
strict lint are not hosted Linux ARM64 acceptance.

## Contract

[.woodpecker.yaml](.woodpecker.yaml) runs `no-comments` on native `push`, `tag`,
and `pull_request` events. The original unfiltered push includes tags; neither
workflow restricts branches or paths. Commands run serially from the repository
root and fail normally:

```sh
uv run --no-project --python 3.14 --with-requirements .comment-policy/requirements.txt python .comment-policy/check.py
uv run --no-project --python 3.14 --with-requirements .comment-policy/requirements.txt python -m unittest discover -s .comment-policy -p 'test_*.py'
```

The approved digest-pinned uv image supports Linux ARM64 and AMD64 with uv 0.11.32 and
Python 3.14. The unchanged requirements pin tree-sitter 0.25.2,
tree-sitter-language-pack 0.13.0, tree-sitter-c-sharp 0.23.5,
tree-sitter-embedded-template 0.25.0, and tree-sitter-yaml 0.7.2. The existing
suite has 13 tests. No application dependencies are installed or upgraded.
Actions uses ubuntu-latest, checkout at
`11d5960a326750d5838078e36cf38b85af677262`, and setup-uv at
`d0d8abe699bfb85fec6de9f7adb5ae17292296ff`, with caching keyed by the requirements
file. The replacement uses native clone and ephemeral uv storage, not a shared
host cache.

Keep the complete checkout and Git index available: the checker enumerates
`git ls-files --cached --others --exclude-standard -z`. Local `--staged` checks
read the complete index with `git ls-files --stage -z` and `git cat-file --batch`,
not just changed paths. Preserve all policy exclusions and regression fixtures.
No job requests all-history or all-ref inputs; native default clone suffices.
Do not substitute an archive, changed-file list, custom clone, or token bootstrap.

## Existing local and deployment boundaries

[Policy documentation](.comment-policy/README.md) and [Lefthook](lefthook.yml)
remain authoritative. Install with `lefthook install pre-commit`; the existing
hook runs `gitleaks protect --staged --no-banner` and the policy command with
`--staged`. Use process-local `mise exec gitleaks@8.30.1 --` for the existing mise
pin. Do not bypass hooks or change instruction files, locks, exclusions, or source.

There is no authored Actions app-build, deploy, publishing, or backup job.
The root Bun build/deploy scripts and the marketing script
`astro build && wrangler deploy` are local commands, not new CI requirements.
The existing deployment configuration is
[apps/marketing/wrangler.toml](apps/marketing/wrangler.toml): Worker
`testappsite-marketing`, static assets `./dist`, compatibility date `2024-12-30`,
and routes `testappsite.net/*` and `www.testappsite.net/*`. Preserve its account,
routes, and any external deployment controller/branch settings; none are defined
as hosted jobs here. No Cloudflare access or deployment is part of this change.
No additional local-verification or archive exception is defined in this tree.

## Parent-owned settings, proof, and cutover

The controlled RED-to-GREEN and same-PR post-disable proof was completed once
in mission-control PR #29 / MC #26. MC #27 does not require per-target intentional
failures, marker commits, artificial or extra test PRs, fresh tag/fork test events,
or a post-disable PR revision. Preserving configured push/tag/PR triggers and fork
approval is distinct from proving actual execution of this target's PR and main.

Use only the existing CAX11 hel1 ARM64/4 GiB agent, capacity one and 2 GiB job
limit. No new capacity or spend, browser/auth changes, trust expansion, or
controller changes. A platform, credential, history, or capacity failure is a
blocker, not permission to narrow inputs or add higher trust.

1. Complete separate reviewed integration, with distinct Standards and Spec
   reviews pinned to the source and integration commits. Record existing Actions
   requirements, protections, rules, and repository/deployment settings without
   changing unrelated requirements or controllers.
2. The parent safely activates and reads back the supported Woodpecker 3.19
   settings: `.woodpecker.yaml`, PRs and push/tag hooks enabled,
   `require_approval: forks`, `approval_allowed_users: []`, and trusted network,
   volumes, and security all false. Set and read back the exact repository timeout
   as **10 minutes**, matching Actions `timeout-minutes: 10`; it is not a YAML key.
   No job secrets, privileged containers, socket/host mounts, or production,
   publishing, or operator credentials. Retain the supported default trusted clone
   boundary without expanding its allowlist or credential scope.
3. Deliver ONE ordinary reviewed PR with Actions still enabled. Prove its exact
   head SHA through actual native PR clone and `no-comments` execution: both
   original commands, all 13 tests, full-checkout policy count, pinned image and
   runtime, Linux ARM64 platform, native pipeline/step IDs and URLs, and matching
   exact-SHA GitHub success. Record observed result contexts, not guessed checks.
4. Merge normally using `--match-head-commit` with that reviewed, proven head SHA.
   Record the actual resulting default-main SHA, tree, parents, and unchanged
   original Actions workflow blob. Prove native push clone/job execution for that
   resulting main SHA, both original commands, all 13 tests, policy count, ARM64
   runtime, and matching exact-SHA GitHub success; PR success alone is insufficient.
5. Only after both PR and resulting default-main proof, replace corresponding
   Actions requirements with the observed Woodpecker result before setting only
   Actions `enabled: false`. Empty requirements/protections/rules make replacement
   a NOOP; never remove or invent unrelated requirements. Preserve workflow bytes,
   deployment controllers, and all other settings.
6. Perform separate fresh GET-only final acceptance of the resulting main identity,
   native results, matching GitHub successes, requirement/settings readbacks, and
   Actions disabled state. Record bounded Actions-run absence observations with
   their revision/time window, not an infinite-future guarantee. Do not generate a
   fresh post-disable event. Record the repository/result in the parent progress
   list; source/local checks do not substitute for these live observations.

For rollback, re-enable the unchanged Actions workflow and restore any recorded
Actions requirement (NOOP if absent) before removing a corresponding replacement
requirement or deactivating Woodpecker. Preserve fork approval and unrelated controller settings. If any
proof fails, leave or restore Actions enabled and report the precise blocker.
Source preparation performs none of these live operations.

Native syntax and settings references:
[workflow syntax](https://woodpecker-ci.org/docs/usage/workflow-syntax),
[project settings](https://woodpecker-ci.org/docs/usage/project-settings), and
[3.19 schema](https://github.com/woodpecker-ci/woodpecker/blob/v3.19.0/pipeline/frontend/yaml/linter/schema/schema.json).
