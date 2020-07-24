const request = require('supertest');
const express = require('express');
const server = express();
const searchRouter = require('../../api/routes/search');

describe('search router endpoint', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/search', searchRouter);
  });

  describe('GET /search', () => {
    it('should return 500 when the request body is invalid', async () => {
      const res = await request(server).get('/search').send({
        test: 'toast',
      });
      expect(res.status).toBe(500);
    });
  });
});
