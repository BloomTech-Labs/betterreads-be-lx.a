const request = require('supertest');
const express = require('express');
const shelfBookConnections = require('../../api/models/shelfBookConnectionModel');
const shelfBookConnectionsRouter = require('../../api/routes/shelfBookConnections');
const server = express();

jest.mock('../../api/models/shelfBookConnectionModel');

describe('shelf-book router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/organize', shelfBookConnectionsRouter);
  });

  describe('GET /organize', () => {
    it('should return 200', async () => {
      shelfBookConnections.findAll.mockResolvedValue([]);
      const res = await request(server).get('/organize');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(shelfBookConnections.findAll.mock.calls.length).toBe(1);
    });
  });

  describe('GET /organize/:id', () => {
    it('should return 200 when shelf-book connection found', async () => {
      shelfBookConnections.findById.mockResolvedValue({
        id: 20,
        ShelfId: 2,
        ConnectionId: 3,
      });
      const res = await request(server).get('/organize/20');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(20);
      expect(res.body.ShelfId).toBe(2);
      expect(res.body.ConnectionId).toBe(3);
      expect(shelfBookConnections.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no shelf-book connection found', async () => {
      shelfBookConnections.findById.mockResolvedValue();
      const res = await request(server).get('/organize/20');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe(
        'Shelf-book connection with id 20 not found.'
      );
    });
  });

  describe('GET /organize/shelf/:shelfId', () => {
    it('should return 200 when shelf-book connections found for specified shelf', async () => {
      shelfBookConnections.findBy.mockResolvedValue([
        {
          id: 20,
          ShelfId: 2,
          ConnectionId: 3,
        },
        {
          id: 21,
          ShelfId: 2,
          ConnectionId: 4,
        },
      ]);
      const res = await request(server).get('/organize/shelf/2');

      expect(res.status).toBe(200);
      expect(res.body[0].id).toBe(20);
      expect(res.body[0].ShelfId).toBe(2);
      expect(res.body[0].ConnectionId).toBe(3);
      expect(shelfBookConnections.findBy.mock.calls.length).toBe(1);
    });
  });
});
