/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const {config} = bedrock;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config.mocha.options.fullTrace = true;
config.mocha.tests.push(path.join(__dirname, 'mocha'));

// Only allow 1 retry for testing
config.redis.retryOptions.retries = 1;
