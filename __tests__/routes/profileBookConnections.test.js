const request = require('supertest');
const express = require('express');
const Connections = require('../../api/models/profileBookConnectionModel');
const connectionsRouter = require('../../api/routes/profileBookConnections');
const server = express();

jest.mock('../../api/models/profileBookConnectionModel');

describe('profile-book router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/connect', connectionsRouter);
  });

  describe('GET /connect', () => {
    it('should return 200', async () => {
      Connections.findAll.mockResolvedValue([]);
      const res = await request(server).get('/connect');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(Connections.findAll.mock.calls.length).toBe(1);
    });
  });

  describe('GET /connect/:id', () => {
    it('should return 200 when profile-book connection found', async () => {
      Connections.findById.mockResolvedValue({
        id: 20,
        profileId: 2,
        bookId: 3,
        readingStatus: 1,
      });
      const res = await request(server).get('/connect/20');

      expect(res.status).toBe(200);
      expect(res.body.profileId).toBe(2);
      expect(res.body.bookId).toBe(3);
      expect(res.body.readingStatus).toBe(1);
      expect(Connections.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no profile-book connection found', async () => {
      Connections.findById.mockResolvedValue();
      const res = await request(server).get('/connect/20');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe(
        'Profile-book connection with id 20 not found.'
      );
    });
  });

  describe('GET /connect/profile/:id', () => {
    it('should return 200 when profile-book connections found for specified user', async () => {
      Connections.findBy.mockResolvedValue({
        id: 20,
        profileId: 2,
        bookId: 3,
        readingStatus: 1,
      });
      const res = await request(server).get('/connect/profile/2');

      expect(res.status).toBe(200);
      expect(res.body.profileId).toBe(2);
      expect(res.body.bookId).toBe(3);
      expect(res.body.readingStatus).toBe(1);
      expect(Connections.findBy.mock.calls.length).toBe(1);
    });
  });

  describe('POST /connect', () => {
    it('should return 200 when profile-book connection is created', async () => {
      const connection = {
        profileId: 11,
        bookId: 2,
        readingStatus: 2,
      };
      Connections.findById.mockResolvedValue(undefined);
      Connections.create.mockResolvedValue([
        Object.assign({ id: 122 }, connection),
      ]);
      const res = await request(server).post('/connect').send(connection);

      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe('profile-book connection created');
      expect(res.status).toBe(200);
      expect(res.body.connection.id).toBe(122);
      expect(Connections.create.mock.calls.length).toBe(1);
    });
  });
  it('should return 400 when profile-book connection is missing in request body', async () => {
    Connections.findById.mockResolvedValue(undefined);
    Connections.create.mockResolvedValue();
    const res = await request(server).post('/connect').send();

    expect(res.body.message).toBeTruthy();
    expect(res.body.message).toBe(
      'Failure to create profile-book connection because info is missing in request body.'
    );
    expect(res.status).toBe(400);
    expect(Connections.create.mock.calls.length).toBe(0);
  });
});
