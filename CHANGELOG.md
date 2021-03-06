# bedrock-redis ChangeLog

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
