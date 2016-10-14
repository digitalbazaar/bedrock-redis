/*
 * Bedrock redis module.
 *
 * This modules exposes an API for accessing a redis key-value cache.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var Backoff = require('backo');
var bedrock = require('bedrock');
var config = bedrock.config;
var redis = require('redis');

// module API
var api = {};
module.exports = api;

var logger = bedrock.loggers.get('app');

api.client = null;

// load config
require('./config');

bedrock.events.on('bedrock.start', function(callback) {
  bedrock.events.emit('bedrock-redis.ready', callback);
});

bedrock.events.on('bedrock.init', init);

function init(callback) {
  var backoff = new Backoff({
    min: config.redis.retry.min,
    max: config.redis.retry.max,
    jitter: config.redis.retry.jitter,
    factor: config.redis.retry.factor
  });
  logger.info(
    'redis: initializing client: ' + config.redis.host + ':' +
    config.redis.port);
  api.client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    retry_strategy: function(options) {
      if(options.error && options.error.code === 'ECONNREFUSED') {
        // end reconnecting on a specific error and flush all commands with an
        // individual error
        logger.error('redis: connection refused');
      }
      if(options.total_retry_time > config.redis.retry.maxTotal) {
        // end reconnecting after a specific timeout and flush all commands
        // with a individual error
        logger.error('redis: exceeded max connection retry time', {
          totalRetryTime: options.total_retry_time,
          timesConnected: options.times_connected
        });
        // FIXME: improve error handling
        return new Error('redis: exceeded max connection retry time');
      }
      if(options.times_connected > config.redis.retry.maxTimesConnected) {
        // end reconnecting
        logger.error('redis: exceeded max connection times', {
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
      var delay = backoff.duration();
      logger.info('redis: will reconnect in ' + delay + 'ms');
      return delay;
    }
  });
  api.client.on('ready', function() {
    logger.info('redis: ready');
  });
  api.client.on('connect', function() {
    logger.info('redis: connected');
    callback();
  });
  api.client.on('reconnecting', function(params) {
    logger.info('redis: reconnecting', {
      attempt: params.attempt,
      delay: params.delay,
      totalRetryTime: params.total_retry_time,
      timesConnected: params.times_connected
    });
  });
  api.client.on('error', function(error) {
    // FIXME: improve error handling
    logger.error('redis:', error);
  });
  api.client.on('end', function() {
    logger.info('redis: connection closed');
  });
  api.client.on('warning', function(msg) {
    logger.warning('redis:', msg);
  });
}
