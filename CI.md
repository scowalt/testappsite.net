# CI source preparation

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

The approved digest-pinned uv image selects Linux ARM64 with uv 0.11.32 and
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

1. After separate merge/review, record the existing Actions required checks and
   repository/deployment settings. Use the supported Woodpecker 3.19 interfaces
   to select `.woodpecker.yaml`, allow PRs and push/tag hooks, require approval
   for forks (`require_approval: forks`), and keep
   `approval_allowed_users: []`. Read back the exact repository timeout as
   **10 minutes**, matching Actions `timeout-minutes: 10`; timeout is a repository
   setting, not a YAML key. Keep trusted network, volumes, and security all false.
   No privileged containers, socket/host mounts, production/publishing/operator
   credentials, or PR secrets are required. Retain the supported default trusted
   clone boundary, without expanding its allowlist or credential scope.
2. Use only the existing CAX11 hel1 ARM64/4 GiB agent, capacity one and 2 GiB job
   limit. No new capacity or spend. A platform, credential, history, or capacity
   failure is a blocker, not permission to narrow inputs or add higher trust.
3. With Actions still enabled, prove a controlled failing PR revision and a
   corrected passing revision using the native runtime. Record exact SHAs,
   commands, image/runtime, all 13 tests, full-checkout policy counts, native
   pipeline/step IDs, GitHub result contexts, and URLs. Verify branch push and
   tag delivery and fork approval without automatically executing unapproved
   fork code. Observe actual result contexts; do not pre-create guessed checks.
4. Only after equivalent hosted proof, replace the old Actions requirement with
   the observed Woodpecker result, preserving unrelated checks and deployment
   controllers. Then disable Actions for this repository and update the same PR
   again to verify Woodpecker runs and no new Actions run starts. Record settings
   readback and the repository/result in the parent progress list.

For rollback, re-enable the unchanged Actions workflow and restore its recorded
required check before removing the replacement requirement or deactivating
Woodpecker. Preserve fork approval and unrelated controller settings. If any
proof fails, leave or restore Actions enabled and report the precise blocker.
Source preparation performs none of these live operations.

Native syntax and settings references:
[workflow syntax](https://woodpecker-ci.org/docs/usage/workflow-syntax),
[project settings](https://woodpecker-ci.org/docs/usage/project-settings), and
[3.19 schema](https://github.com/woodpecker-ci/woodpecker/blob/v3.19.0/pipeline/frontend/yaml/linter/schema/schema.json).
