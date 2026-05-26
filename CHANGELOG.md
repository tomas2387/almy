# Changelog

All notable changes to this project will be documented in this file.

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
