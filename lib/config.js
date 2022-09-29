/*
 * Bedrock redis configuration.
 *
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';
const {config} = bedrock;

config.redis = {};
config.redis.host = 'localhost';
config.redis.port = 6379;
// retry backoff control
config.redis.retryOptions = {
  // min retry delay (ms)
  minTimeout: 1000,
  // max retry delay (ms)
  maxTimeout: 1000 * 60,
  // backoff factor [>1]
  factor: 1.2,
  // max total retry time (ms)
  retries: Infinity
};
