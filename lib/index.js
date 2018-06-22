/*
 * Bedrock redis module.
 *
 * This modules exposes an API for accessing a redis key-value cache.
 *
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const Client = require('./client');

// module API
const api = {};
module.exports = api;

api.client = null;
api.Client = Client;

// load config
require('./config');

bedrock.events.on('bedrock.start', () =>
  bedrock.events.emit('bedrock-redis.ready'));

bedrock.events.on('bedrock.init', () => {
  api.client = new Client().client;
});
