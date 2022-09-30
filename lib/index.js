/*
 * Bedrock redis module.
 *
 * This modules exposes an API for accessing a redis key-value cache.
 *
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import {createClient} from './client.js';
import {logger} from './logger.js';
import './config.js';

const {util: {BedrockError}, config} = bedrock;

let _client = null;
bedrock.events.on(
  'bedrock.start', () => bedrock.events.emit('bedrock-redis.ready'));
bedrock.events.on('bedrock.init', _init);

async function _init() {
  try {
    _client = await createClient();
  } catch(error) {
    logger.error('Could not connect to redis', {error});
    throw new BedrockError(
      'Could not connect to redis.', {
        host: config.redis.host,
        port: config.redis.port
      }, error);
  }
}

export {_client as client, createClient};
