/*
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as retry from 'retry';
import {config} from '@bedrock/core';
import {logger} from './logger.js';
import redis from 'redis';

export async function createClient({
  host = config.redis.host,
  port = config.redis.port,
} = {}) {
  logger.debug(`Initializing redis client at: ${host}:${port}`);
  const client = redis.createClient({
    socket: {
      host,
      port,
      reconnectStrategy: attempt => {
        const max = config.redis.retryOptions.retries;
        if(attempt > max) {
          return new Error(`Exceeded max (${max}) connection attempts.`);
        }
        // Calculates a timeout based on current attempt and
        // retry options from this modules config.
        return retry.createTimeout(attempt, config.redis.retryOptions);
      }
    }
  });
  client.on('ready', () => logger.debug(`Connected to redis.`));
  client.on('end', () => logger.debug('Connection to redis closed.'));
  client.on('error', error => logger.error(`Redis error: ${error}.`));
  await client.connect();
  return client;
}
