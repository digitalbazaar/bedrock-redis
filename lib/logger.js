/*
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

module.exports = bedrock.loggers.get('app').child('redis');
