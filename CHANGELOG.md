# bedrock-redis ChangeLog

## 4.0.0 - 2022-xx-xx

### Changed
- **BREAKING**: Rename package from `bedrock-redis` to `@bedrock/redis`.
- **BREAKING** Convert to module (ESM).
- **BREAKING** Update redis client to v4, use node-redis directly.
- **BREAKING** Use namespaced and up to date bedrock packages throughout.
- **BREAKING** Remove `prefix` option.
- **BREAKING** Update retry options due to changing from `backo` package to `retry`:
  - Rename `bedrock.config.redis.retry` to `bedrock.config.redis.retryOptions`.
  - Rename `min`/`max` to `minTimeout`/`maxTimeout`.
  - Rename `maxTimesConnected` to `retries`.
  - Remove `jitter` and `maxTotal`.
- **BREAKING**: Require Node.js >=16.
- Use `package.json` `files` field.

### Added
- Lint code.
- Add tests.

## 3.4.1 - 2019-11-12

### Changed
- Update max bedrock dependency.

## 3.4.0 - 2018-08-22

### Added
- Support promises. Uses `promise-redis` which requires
  a peer dependency of `redis` (but specifies it via a
  regular dependency of version `"*"`).

## 3.3.1 - 2018-06-26

### Fixed
- Config variable assignment.

## 3.3.0 - 2018-06-26

### Added
- `prefix` option. A string used to prefix all used keys (e.g. namespace:test).

## 3.2.0 - 2018-02-24

### Added
- New `Client` class that allows additional client instances to be created.

## 3.1.0 - 2016-10-14

### Changed
- Use 'backo' for backoff calculation.
- Logging cleanup.

### Added
- Backoff config.
- Max connection times.

## 3.0.0 - 2016-10-12

### Changed
- **BREAKING**: Update redis dependency.
- Handle more events.
- Handle reconnects with slow backoff and random delay jitter.

## 2.0.1 - 2016-03-15

### Changed
- Update bedrock dependencies.

## 2.0.0 - 2016-03-03

### Changed
- Update package dependencies for npm v3 compatibility.

## 1.0.0 - 2016-01-31

- See git history for changes.
