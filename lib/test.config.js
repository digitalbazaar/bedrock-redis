/*
 * Bedrock redis configuration.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;

config.redis = {};
config.redis.host = 'localhost';
config.redis.port = 6379;
