# Contributing to almy

## General structure

```
almy/
├── almy.js              # core source module
├── almy.d.ts            # hand-written TypeScript types (published)
├── dist/                # minified builds for different module systems (generated)
├── __test__/unit/       # Vitest unit tests
├── __test__/types.test-d.ts # type tests for almy.d.ts
├── rollup.config.mjs    # build configuration
├── vitest.config.mts    # test configuration
├── tsconfig.types.json  # TypeScript config used only by the type tests
├── package.json         # npm metadata and scripts
└── .github/workflows/   # CI workflows (tests, CodeQL, npm publish)
```

## Core module (almy.js)

Holds a singleton‑style store with two private prototype‑less objects
(`Object.create(null)`): `state` (current values) and `listeners` (arrays of
callbacks per key).

Exports a single `almy` object with four methods:

- `create()` – resets state and listeners to start fresh.
- `state(key?)` – returns the entire state or the value of a specific key.
- `dispatch(key, value)` – updates state and notifies listeners.
  Handles nested keys using `->` and dispatches individual properties when an
  object is supplied, skipping inherited properties and repeated values.
  Changes to a nested key are also propagated up to its parent keys.
- `subscribe(key, callback)` – registers a listener, immediately invokes it
  if the key already exists, and returns an unsubscribe function.

## Build and tooling

Built with Rollup (`rollup.config.mjs`) using the terser plugin to produce UMD and ESM
bundles in `dist/`. Do not edit `dist/` by hand.

- `npm run build` – builds the bundles with Rollup.
- `npm test` – formats with Prettier, builds, and runs Vitest with coverage.
- `npm run mutation` – runs Stryker mutation testing on `almy.js`. CI fails if
  any mutant survives, so every new behavior needs a test that pins it down.

## Testing

Unit tests in `__test__/unit/` cover primitive values, object/array dispatch
behavior, immediate callbacks for existing state, nested subscriptions at any
depth, and standalone (destructured) usage.

`almy.d.ts` is written by hand. `npm test` also type-checks
`__test__/types.test-d.ts`, so update both whenever the public API changes.

## Important things to know

- Keys use a `key->property` convention for nested paths.
- `dispatch` avoids redundant notifications by comparing against the current state.
- `subscribe` returns an unsubscribe function so listeners can be removed without
  resetting the store.
- Only `dist/*`, `almy.d.ts`, `README.md`, `LICENSE` and `package.json` are published to npm
  (`files` field in `package.json`), so keep the README focused on users.
- The publish workflow strips `scripts`, `devDependencies` and `allowScripts`
  from the published `package.json` to keep the package small.
- Releases are published to npm by creating a GitHub release. The workflow uses
  npm Trusted Publishing (OIDC), so no npm token is stored in the repository,
  and stages the version (`npm stage publish`). It only becomes public after a
  maintainer approves it with 2FA on npmjs.com or with `npm stage approve <id>`.
