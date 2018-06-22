/*
 * Bedrock redis configuration.
 *
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
const {config} = require('bedrock');

config.redis = {};
config.redis.host = 'localhost';
config.redis.port = 6379;

// A string used to prefix all used keys (e.g. namespace:test).
// `prefix` is useful when multiple bedrock applications share the same redis
// instance in order to prevent key collisions and simplify debugging.
// `prefix` should be as few characters as possible because the memory
// footprint of every key will be increased by one byte per character.
config.redis.prefix = null;

// retry backoff control
config.redis.retry = {
  // min retry delay (ms)
  min: 1000,
  // max retry delay (ms)
  max: 1000 * 60,
  // jitter (%) [0-1]
  jitter: 0.05,
  // backoff factor [>1]
  factor: 1.2,
  // max total retry time (ms)
  maxTotal: Infinity,
  // max number of times client will connect
  maxTimesConnected: Infinity
};
