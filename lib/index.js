/*
 * Bedrock redis module.
 *
 * This modules exposes an API for accessing a redis key-value cache.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var redis = require('redis');
var bedrock = require('bedrock');
var config = bedrock.config;

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
  logger.info(
    'redis: initializing client: ' + config.redis.host + ':' +
    config.redis.port);
  api.client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    retry_strategy: function(options) {
      if(options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with an
        // individual error
        logger.error('redis: connection refused');
        //return new Error('Redis: the server refused the connection');
      }
      if(options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        logger.error(
          'redis: total retry time exhausted', options.total_retry_time);
        // FIXME: improve error handling
        return new Error('redis: retry time exhausted');
      }
      /*
      if (options.times_connected > 10) {
        // End reconnecting with built in error
        return undefined;
      }
      */
      // reconnect delay
      // add slight random fuzz to unsync multiple client reconnects
      var fuzz = Math.floor(Math.random() * 250);
      var delay = Math.max(options.attempt * 200, 3000) + fuzz;
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
    logger.info('redis: end');
  });
  api.client.on('warning', function(msg) {
    logger.warning('redis:', msg);
  });
}
