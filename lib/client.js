/*
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const logger = require('./logger');
const redis = require('redis');
const Backoff = require('backo');

module.exports = class Client {
  constructor({
    host = config.redis.host, port = config.redis.port,
    prefix = config.redis.prefix
  } = {}) {
    // TODO: allow backoff options to be passed in
    const backoff = new Backoff({
      min: config.redis.retry.min,
      max: config.redis.retry.max,
      jitter: config.redis.retry.jitter,
      factor: config.redis.retry.factor
    });
    logger.verbose(`initializing client: ${host}:${port}`);
    this.client = redis.createClient({
      host,
      port,
      prefix,
      retry_strategy: options => {
        if(options.error && options.error.code === 'ECONNREFUSED') {
          // end reconnecting on a specific error and flush all commands with an
          // individual error
          logger.error('connection refused');
        }
        if(options.total_retry_time > config.redis.retry.maxTotal) {
          // end reconnecting after a specific timeout and flush all commands
          // with a individual error
          logger.error('exceeded max connection retry time', {
            totalRetryTime: options.total_retry_time,
            timesConnected: options.times_connected
          });
          // FIXME: improve error handling
          return new Error('redis: exceeded max connection retry time');
        }
        if(options.times_connected > config.redis.retry.maxTimesConnected) {
          // end reconnecting
          logger.error('exceeded max connection times', {
            totalRetryTime: options.total_retry_time,
            timesConnected: options.times_connected
          });
          // FIXME: improve error handling
          return new Error('redis: exceed max connection times');
        }
        // reconnect delay with backoff
        if(options.attempt === 1) {
          backoff.reset();
        }
        const delay = backoff.duration();
        logger.info(`will reconnect in ${delay}ms`);
        return delay;
      }
    });

    // FIXME: improve error handling
    this.client.on('error', error => logger.error(`redis error: ${error}`));
    this.client.on('end', () => logger.verbose('connection closed'));
    this.client.on('warning', msg => logger.warning(`redis warning: ${msg}`));
  }
};
