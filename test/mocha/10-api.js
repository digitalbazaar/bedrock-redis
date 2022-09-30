/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {client, createClient} from '@bedrock/redis';

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
    } catch(error) {
      err = error;
    }
    should.not.exist(err);
    res.should.equal('redis-test');
  });
  it('should attempt to reconnect', async () => {
    let err;
    try {
      await createClient({host: 'error'});
    } catch(error) {
      err = error.message;
    }
    should.exist(err);
    err.should.equal('Exceeded max (1) connection attempts.');
  });
});
