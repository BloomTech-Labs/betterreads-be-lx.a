const request = require('supertest');
const express = require('express');
const Shelves = require('../../api/models/shelfModel');
const shelfRouter = require('../../api/routes/shelves');
const server = express();

jest.mock('../../api/models/shelfModel');

describe('shelves router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/shelves', shelfRouter);
  });

  describe('GET /shelves', () => {
    it('should return 200', async () => {
      Shelves.findAll.mockResolvedValue([]);
      const res = await request(server).get('/shelves');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(Shelves.findAll.mock.calls.length).toBe(1);
    });
  });
});
