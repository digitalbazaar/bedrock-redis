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
  logger.debug(`Initializing client at: ${host}:${port}`);
  const client = redis.createClient({
    socket: {
      host,
      port,
      reconnectStrategy: attempt => {
        const max = config.redis.retry.retries;
        if(attempt > max) {
          return new Error(`Exceeded max (${max}) connection attempts.`);
        }
        // Calculates a timeout based on current attempt and
        // retry options from this modules config.
        const timeout = retry.createTimeout(attempt, config.redis.retry);
        logger.info(
          `Attempt ${attempt} failed, will reconnect in ${timeout}ms`);
        return timeout;
      }
    }
  });
  client.on('connect', () => logger.debug(`Initiating connection.`));
  client.on('reconnecting', () => logger.debug(`Reconnecting...`));
  client.on('ready', () => logger.debug(`Connected to redis.`));
  client.on('end', () => logger.debug('Connection to redis closed.'));
  client.on('error', error => logger.error(`Redis error: ${error}.`));
  await client.connect();
  return client;
}
