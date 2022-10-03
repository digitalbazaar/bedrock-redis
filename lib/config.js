/*
 * Bedrock redis configuration.
 *
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from '@bedrock/core';

config.redis = {};
config.redis.host = 'localhost';
config.redis.port = 6379;
// retry backoff control
config.redis.retry = {
  // min retry delay (ms)
  minTimeout: 1000,
  // max retry delay (ms)
  maxTimeout: 1000 * 60,
  // backoff factor [>1]
  factor: 1.2,
  // number of times to retry
  retries: Infinity,
  // randomize timeouts by multiplying with a factor between 1 to 2
  randomize: false
};
