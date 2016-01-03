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

bedrock.events.on('bedrock.test.configure', function() {
  // load test config
  require('./test.config');
});

bedrock.events.on('bedrock.start', function(callback) {
  bedrock.events.emit('bedrock-redis.ready', callback);
});

bedrock.events.on('bedrock.init', init);
function init(callback) {
  logger.info(
    'initializing Redis client: ' + config.redis.host + ':' +
    config.redis.port);
  api.client = redis.createClient(config.redis.port, config.redis.host);
  api.client.on('connect', function() {
    callback();
  });
}
