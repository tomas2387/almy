# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0] - 2026-11-11

### Breaking
- `almy.state()` now returns a prototype-less object (`Object.create(null)`), so it no longer inherits methods such as `hasOwnProperty`. Use `Object.prototype.hasOwnProperty.call(state, key)` or `key in state` instead.
- Remove `dist/almy.cjs.js`. `require('almy')` keeps working: `main` now points to the UMD build, which supports CommonJS. Only direct imports of `almy/dist/almy.cjs.js` need to change to `almy` or `almy/dist/almy.umd.js`.

### Changed
- Reduce published package size (10.8 kB → 6.6 kB): move contributor docs to CONTRIBUTING.md, trim README, strip dev-only fields from the published package.json, and minify better
- Update CI to Node 26 and latest GitHub Actions versions
- Run CodeQL on the master branch
- Fix install size badge in README

### Security
- Store state and listeners in prototype-less objects, fixing CodeQL alert #4 (prototype-polluting assignment)

### Fixed
- `subscribe` no longer throws for keys that match inherited properties (`toString`, `hasOwnProperty`, `__proto__`)
- `state(key)` no longer returns inherited properties such as `Object.prototype` or `toString`

### Testing
- Add Stryker mutation testing (100% mutation score, enforced in CI) and reach 100% branch coverage

### Dependencies
- Bump vitest and @vitest/coverage-v8 to 5.1.0
- Bump @rollup/plugin-terser to 1.0.2, rollup to 4.68.2 and prettier to 3.9.10
- Add @stryker-mutator/core and @stryker-mutator/vitest-runner 10.1.1

## [3.0.3] - 2026-05-26

### Fixed
- Align Vitest and @vitest/coverage-v8 versions to v4

### Changed
- Add README.md and LICENSE to published package files

### Dependencies
- Bump picomatch from 4.0.3 to 4.0.4
- Bump postcss from 8.5.6 to 8.5.15
- Bump serialize-javascript and @rollup/plugin-terser
- Bump vite from 7.1.3 to 7.3.2
- Bump glob and @vitest/coverage-v8
- Bump minimatch from 9.0.5 to 9.0.9
- Bump rollup from 4.46.2 to 4.59.0

## [3.0.2] - 2025-08-20

### Changed
- Update package.json and package-lock.json

## [3.0.1] - 2025-08-20

### Changed
- Update Node.js version in CI

## [3.0.0] - 2025-08-20

### Added
- Unsubscribe support (#44)
- Deep object subscription support (#36)

### Fixed
- Prevent prototype pollution in state (#52)
- Fix subscribe presence check (#41)

### Changed
- Switch to default export (#54)
- Replace done callbacks with async tests for Vitest (#57)
- Inline key safety check (#53)
- Avoid Object.hasOwn for broader compatibility (#47)
- Use GitHub Actions badges (#55)
- Bump esbuild, vitest and @vitest/coverage-v8 (#58)

## [2.0.0] - 2019-06-25

### Changed
- Rollup build with UMD, CJS and ESM outputs
- Migrate test suite from Mocha to Jest
- Add Prettier as dev dependency

## [1.1.2] - 2018-10-28

### Changed
- Simplify internals
- Update README

## [1.1.0] - 2018-10-28

### Changed
- Rename `getState` to `state`

## [1.0.0] - 2018-10-28

- Initial stable release
