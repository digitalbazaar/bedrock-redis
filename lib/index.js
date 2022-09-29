/*
 * Bedrock redis module.
 *
 * This modules exposes an API for accessing a redis key-value cache.
 *
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';
import {Client} from './client.js';
import './config.js';

export let client = null;
bedrock.events.on('bedrock.start',
  () => bedrock.events.emit('bedrock-redis.ready')
);
bedrock.events.on('bedrock.init', async () => {
  client = new Client();
  client.connect();
});

export default {
  client,
  Client
};
