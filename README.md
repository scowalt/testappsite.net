# testappsite.net

Bun workspace for testappsite.net. The marketing site in `apps/marketing` is an
Astro static site served by the `testappsite-marketing` Cloudflare Worker.

## Develop

```sh
bun install
bun run dev:marketing
```

## CI and deployment

- GitHub Actions `CI` builds the site and runs `wrangler deploy --dry-run` on
  every pull request and every push to `main`.
- Cloudflare Workers Builds deploys `main` to production
  (`testappsite.net` and `www.testappsite.net`) after every merge. Other
  branches get a preview version from `wrangler versions upload`, reported as
  the `Workers Builds: testappsite-marketing` check.
- Workers Builds runs `bun run build:marketing` from the repository root, then
  runs `wrangler` from `apps/marketing`.

`bun run deploy` still deploys from a local checkout, but merging to `main` is
the normal path.
