const request = require('supertest');
const express = require('express');
const shelfBookConnections = require('../../api/models/shelfBookConnectionModel');
const shelfBookConnectionsRouter = require('../../api/routes/shelfBookConnections');
const Shelves = require('../../api/models/shelfModel');
const server = express();
server.use(express.json());

jest.mock('../../api/models/shelfBookConnectionModel');
jest.mock('../../api/models/shelfModel');

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

    it('should return 500 when shelf-book connections are not found', async () => {
      shelfBookConnections.findAll.mockRejectedValue(new Error('DB error'));
      const res = await request(server).get('/organize');

      expect(res.status).toBe(500);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe('Failure to GET shelf-book connections');
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe('DB error');
      expect(shelfBookConnections.findAll.mock.calls.length).toBe(2);
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
      expect(shelfBookConnections.findById.mock.calls.length).toBe(2);
    });

    it('should return 500 when shelf-book connection is not found due to DB error', async () => {
      shelfBookConnections.findById.mockRejectedValue(new Error('DB error'));
      const res = await request(server).get('/organize/20');

      expect(res.status).toBe(500);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to GET shelf-book connection with id 20.'
      );
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe('DB error');
      expect(shelfBookConnections.findById.mock.calls.length).toBe(3);
    });
  });

  describe('GET /organize/shelf/:shelfId', () => {
    it('should return 200 when shelf-book connections found for specified shelf', async () => {
      Shelves.findById.mockResolvedValue({
        id: 2,
        name: 'Books Better Than Their Movies',
        profileId: 8,
      });
      shelfBookConnections.findByShelfId.mockResolvedValue([
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
      expect(Shelves.findById.mock.calls.length).toBe(1);
      expect(shelfBookConnections.findByShelfId.mock.calls.length).toBe(1);
    });

    it('should return 404 when specified shelf is not found', async () => {
      Shelves.findById.mockResolvedValue(undefined);

      const res = await request(server).get('/organize/shelf/2000');

      expect(res.status).toBe(404);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe(
        'Failure to GET shelf-book connections because shelf with ShelfId 2000 was not found.'
      );
      expect(Shelves.findById.mock.calls.length).toBe(2);
      expect(shelfBookConnections.findByShelfId.mock.calls.length).toBe(1);
    });

    it('should return 404 when shelf-book connections are not found for specified shelf', async () => {
      Shelves.findById.mockResolvedValue({
        id: 3,
        name: 'Books That Look Good Enough to Eat',
        profileId: 8,
      });
      shelfBookConnections.findByShelfId.mockResolvedValue([]);
      const res = await request(server).get('/organize/shelf/3');

      expect(res.status).toBe(404);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe(
        'Shelf-book connections where ShelfId is 3 are not found.'
      );
      expect(Shelves.findById.mock.calls.length).toBe(3);
      expect(shelfBookConnections.findByShelfId.mock.calls.length).toBe(2);
    });

    it('should return 500 when shelf-book connections are not found due to DB error', async () => {
      Shelves.findById.mockResolvedValue({
        id: 4,
        name: 'Favorite Books About Axolotls',
        profileId: 8,
      });
      shelfBookConnections.findByShelfId.mockRejectedValue(
        new Error('DB error')
      );
      const res = await request(server).get('/organize/shelf/4');

      expect(res.status).toBe(500);
      expect(res.body.error).toBeTruthy();
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to GET shelf-book connections where ShelfId is 4.'
      );
      expect(Shelves.findById.mock.calls.length).toBe(4);
      expect(shelfBookConnections.findByShelfId.mock.calls.length).toBe(3);
    });
  });

  describe('POST /organize/:shelfId/:profileBookConnectionId', () => {
    it('should return 200 when shelf-book connection is created', async () => {
      const newShelfBookConnection = {
        id: 122,
        ShelfId: 3,
        ConnectionId: 4,
      };
      shelfBookConnections.duplicateCheck.mockResolvedValue([]);
      shelfBookConnections.create.mockResolvedValue(newShelfBookConnection);
      const res = await request(server).post('/organize/3/4');
      expect(res.status).toBe(200);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe('shelf-book connection created');

      expect(res.body.connection).toBeTruthy();
      expect(res.body.connection.id).toBe(122);
      expect(res.body.connection.ShelfId).toBe(3);
      expect(res.body.connection.ConnectionId).toBe(4);
      expect(shelfBookConnections.duplicateCheck.mock.calls.length).toBe(1);
      expect(shelfBookConnections.create.mock.calls.length).toBe(1);
    });

    it('should return 400 when shelf-book connection already exists', async () => {
      const existingShelfBookConnection = [
        {
          id: 122,
          ShelfId: 3,
          ConnectionId: 4,
        },
      ];
      shelfBookConnections.duplicateCheck.mockResolvedValue(
        existingShelfBookConnection
      );

      const res = await request(server).post('/organize/3/4');
      expect(res.status).toBe(400);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'shelf-book connection with id 122 already exists'
      );
      expect(shelfBookConnections.duplicateCheck.mock.calls.length).toBe(2);
      expect(shelfBookConnections.create.mock.calls.length).toBe(1);
    });

    it('should return 500 when shelf-book connection is not added, due to DB error', async () => {
      shelfBookConnections.duplicateCheck.mockResolvedValue([]);
      shelfBookConnections.create.mockRejectedValue(new Error('DB error'));

      const res = await request(server).post('/organize/3/4');
      expect(res.status).toBe(500);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to create new shelf-book connection'
      );
      expect(res.body.error).toBeTruthy();
      expect(shelfBookConnections.duplicateCheck.mock.calls.length).toBe(3);
      expect(shelfBookConnections.create.mock.calls.length).toBe(2);
    });
  });

  describe('DELETE /organize/:id', () => {
    it('should return 200 when shelf-book connection is successfully deleted', async () => {
      shelfBookConnections.findById.mockResolvedValue({
        id: 20,
        ShelfId: 2,
        ConnectionId: 3,
      });
      shelfBookConnections.remove.mockResolvedValue(1);
      const res = await request(server).delete('/organize/20');

      expect(res.status).toBe(200);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Shelf-book connection with id 20 was deleted.'
      );
      expect(res.body.count_of_deleted_connections).toBeTruthy();
      expect(res.body.count_of_deleted_connections).toBe(1);
      expect(shelfBookConnections.findById.mock.calls.length).toBe(4);
    });

    it('should return 404 when no shelf-book connection found', async () => {
      shelfBookConnections.findById.mockResolvedValue();
      const res = await request(server).delete('/organize/20');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(
        'Unable to delete shelf-book connection because shelf-book connection with id 20 not found.'
      );
      expect(shelfBookConnections.findById.mock.calls.length).toBe(5);
    });

    it('should return 500 when shelf-book connection is not found due to DB error', async () => {
      shelfBookConnections.findById.mockRejectedValue(new Error('DB error'));
      const res = await request(server).delete('/organize/20');

      expect(res.status).toBe(500);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to delete shelf-book connection with id 20.'
      );
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe('DB error');
      expect(shelfBookConnections.findById.mock.calls.length).toBe(6);
    });
  });
});
