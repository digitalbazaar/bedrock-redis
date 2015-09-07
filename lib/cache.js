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

api.client = null;

// load config defaults
bedrock.events.on('bedrock.configure', function() {
  // load config
  require('./config');
});

bedrock.events.on('bedrock.test.configure', function() {
  // load test config
  require('./test.config');
});

bedrock.events.on('bedrock.init', init);
bedrock.events.on('bedrock.start', function(callback) {
  bedrock.events.emit('bedrock-redis.ready', callback);
});

function init(callback) {
  api.client = redis.createClient(config.redis.port, config.redis.host);
  api.client.on('connect', function() {
    callback();
  });
}
