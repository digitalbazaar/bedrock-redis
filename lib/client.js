/*
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as retry from 'retry';
import {config} from '@bedrock/core';
import logger from './logger.js';

import {createClient} from 'redis';

export class Client {
  constructor({
    host = config.redis.host,
    port = config.redis.port,
  } = {}) {
    logger.debug(`initializing client at: ${host}:${port}`);
    this.client = createClient({
      socket: {host, port, reconnectStrategy: attempt => {
        if(attempt > config.redis.retryOptions.retries) {
          return new Error('Exceeded max connection attempts.');
        }
        // Calculates a timeout based on current attempt and
        // retry options from this modules config.
        return retry.createTimeout(attempt, config.redis.retryOptions);
      }
      }});
    this.client.on('ready', () => logger.debug(`Connected to redis.`));
    this.client.on('error', error => logger.error(`Redis error: ${error}.`));
    this.client.on('end', () => logger.debug('Connection to redis closed.'));
  }

  async connect() {
    try {
      await this.client.connect();
    } catch(error) {
      logger.error('Unable to connect to redis.', {error});
    }
  }
}
