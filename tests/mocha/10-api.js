/*!
 * Copyright (c) 2021 Dogwood Logic, Inc. All rights reserved.
 */
import {client} from '@bedrock/redis';

describe('api', () => {
  it('should have a valid redis client', async () => {
    should.exist(client);
    client.should.be.a('object');
  });
  it('should be able to store value in redis', async () => {
    let err;
    let res;
    try {
      const key = 'testStr';
      res = await client.set(key, 'redis-test');
      // login success should return undefined
    } catch(error) {
      err = error;
    }
    should.not.exist(err);
    res.should.equal('OK');
  });
  it('should be able to retrieve value from redis', async () => {
    let err;
    let res;
    try {
      const key = 'testStr';
      res = await client.get(key);
      // login success should return undefined
    } catch(error) {
      err = error;
    }
    should.not.exist(err);
    res.should.equal('redis-test');
  });
});
