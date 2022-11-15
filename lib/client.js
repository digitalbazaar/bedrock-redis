/*
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as retry from 'retry';
import {config} from '@bedrock/core';
import {logger} from './logger.js';
import redis from 'redis';

export async function createClient({host, port} = {}) {
  const {socket: socketOptions, client: clientOptions} = config.redis;
  // allow override of host and port
  if(host) {
    socketOptions.host = host;
  }
  if(port) {
    socketOptions.port = port;
  }
  const socket = {
    // merge socket options from config
    ...socketOptions,
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
    },
  };
  if(clientOptions.url) {
    logger.debug(`Initializing client at: ${clientOptions.url}`);
  } else {
    logger.debug(`Initializing client at: ${host}:${port}`);
  }
  const client = redis.createClient({socket, ...clientOptions});
  client.on('connect', () => logger.debug(`Initiating connection.`));
  client.on('reconnecting', () => logger.debug(`Reconnecting...`));
  client.on('ready', () => logger.debug(`Connected to redis.`));
  client.on('end', () => logger.debug('Connection to redis closed.'));
  client.on('error', error => logger.error(`Redis error: ${error}.`));
  await client.connect();
  return client;
}
