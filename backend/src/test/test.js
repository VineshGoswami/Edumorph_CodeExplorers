import request from 'supertest';
import app from '../../server.js';

describe('GET /', () => {
  it('should respond ok', async () => {
    const res = await request(app).get('/');
    if (res.status !== 200 || !res.body.ok) throw new Error('Health check failed');
  });
});
