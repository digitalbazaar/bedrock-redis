/*
 * Bedrock redis configuration.
 *
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;

config.redis = {};
config.redis.host = 'localhost';
config.redis.port = 6379;

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
