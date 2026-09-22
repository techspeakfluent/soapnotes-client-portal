# Soap Notes Client Portal

The client-facing portal for Soap Notes. React + TypeScript + Vite, styled with
Chakra UI v3 and the Soap Notes theme.

## Getting started

```bash
pnpm install
cp .env.example .env   # then set VITE_API_BASE_URL
pnpm dev               # http://localhost:3000
```

## Scripts

| Command            | What it does                            |
| ------------------ | --------------------------------------- |
| `pnpm dev`         | Start the dev server                    |
| `pnpm build`       | Type-check and build for production     |
| `pnpm check-types` | Regenerate theme typings and type-check |
| `pnpm lint`        | Lint                                    |
| `pnpm format`      | Format with Prettier                    |

## Structure

```
src/
  components/ui/   shared UI pieces
  features/<name>/ one folder per feature: pages, templates, components, routes, api
  lib/             axios, react-query, storage
  provider/        app-wide providers
  routes/          router setup
  shared/          constants (env, routes)
  theme/           Soap Notes theme — keep in step with soapnotes-web
  utils/           small helpers
```

## Commits

Commits follow Conventional Commits (`feat:`, `fix:`, `chore:` …), checked by
commitlint. Hooks run format, lint and type-check before each commit, and
type-check + lint before each push.
