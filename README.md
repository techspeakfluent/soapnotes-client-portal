# Soap Notes Client Portal

The client-facing portal for Soap Notes. React + TypeScript + Vite, styled with
Chakra UI v3 and the Soap Notes theme.

## Getting started

```bash
pnpm install
cp .env.example .env   # then set VITE_API_BASE_URL
pnpm dev               # http://localhost:3000
```

### Mock data

Until the client-portal endpoints exist, every `features/*/api/service.ts`
serves fixtures from `src/mocks/` (paged, filtered and sorted the way the
server will). Set `VITE_MOCK_SCENARIO` to `empty` for a brand-new client or
`error` to make every request fail. On the sign-in screen, **Continue with
demo account** gets you in.

The endpoints the portal needs are listed in
[`docs/api-needed.md`](docs/api-needed.md).

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
  components/      layout (shell, sidebar, header), icons, shared UI pieces
  features/<name>/ one folder per feature: pages, templates, components, routes, api
  lib/             axios, react-query, storage
  mocks/           fixtures and the mock responses services return for now
  provider/        app-wide providers
  routes/          router setup
  shared/          constants (env, routes, query keys) and API interfaces
  theme/           Soap Notes theme — keep in step with soapnotes-web
  utils/           small helpers
```

## Commits

Commits follow Conventional Commits (`feat:`, `fix:`, `chore:` …), checked by
commitlint. Hooks run format, lint and type-check before each commit, and
type-check + lint before each push.
