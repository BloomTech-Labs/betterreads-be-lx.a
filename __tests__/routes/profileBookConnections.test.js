const request = require('supertest');
const express = require('express');
const Connections = require('../../api/models/profileBookConnectionModel');
const Profiles = require('../../api/models/profileModel');
const connectionsRouter = require('../../api/routes/profileBookConnections');
const server = express();
server.use(express.json());

jest.mock('../../api/models/profileBookConnectionModel');
jest.mock('../../api/models/profileModel');

describe('profile-book router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/connect', connectionsRouter);
  });

  describe('GET /connect', () => {
    it('should return 200 when connections are found', async () => {
      Connections.findAll.mockResolvedValue([]);
      const res = await request(server).get('/connect');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(Connections.findAll.mock.calls.length).toBe(1);
    });

    it('should return 500 when connections are not found', async () => {
      Connections.findAll.mockRejectedValue(new Error('DB error'));
      const res = await request(server).get('/connect');

      expect(res.status).toBe(500);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe('Failure to GET profile-book connections');
      expect(res.body.error).toBeTruthy();
      expect(Connections.findAll.mock.calls.length).toBe(2);
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

    it('should return 500 when profile-book connection is not found due to DB error', async () => {
      Connections.findById.mockRejectedValue(new Error('DB error'));
      const res = await request(server).get('/connect/20');

      expect(res.status).toBe(500);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to GET profile-book connection with id 20.'
      );
      expect(res.body.error).toBeTruthy();
      expect(Connections.findById.mock.calls.length).toBe(3);
    });
  });

  describe('GET /connect/profile/:id', () => {
    it('should return 200 when profile-book connections found for specified user', async () => {
      Profiles.findById.mockResolvedValue({
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
      });
      Connections.findByProfileId.mockResolvedValue([
        {
          id: 20,
          profileId: 2,
          bookId: 3,
          readingStatus: 1,
        },
      ]);
      const res = await request(server).get('/connect/profile/2');

      expect(res.status).toBe(200);
      expect(res.body[0].profileId).toBe(2);
      expect(res.body[0].bookId).toBe(3);
      expect(res.body[0].readingStatus).toBe(1);
      expect(Connections.findByProfileId.mock.calls.length).toBe(1);
      expect(Profiles.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when specified user exists, but no profile-book connections are not found for that specified user', async () => {
      Profiles.findById.mockResolvedValue({
        id: '200',
        name: 'Suzanne Collins',
        email: 'suzanne@example.com',
      });
      Connections.findByProfileId.mockResolvedValue([]);
      const res = await request(server).get('/connect/profile/200');

      expect(res.status).toBe(404);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe(
        'Profile-book connections with profile id 200 not found.'
      );
      expect(Profiles.findById.mock.calls.length).toBe(2);
      expect(Connections.findByProfileId.mock.calls.length).toBe(2);
    });

    it('should return 404 when profile-user connections are not found because specified user does not exist,', async () => {
      Profiles.findById.mockResolvedValue(undefined);
      const res = await request(server).get('/connect/profile/2000');

      expect(res.status).toBe(404);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe(
        'Failure to get profile-book connections because profile with id 2000 not found.'
      );
      expect(Profiles.findById.mock.calls.length).toBe(3);
      expect(Connections.findByProfileId.mock.calls.length).toBe(2);
    });

    it('should return 500 when profile-user connections are not found because of DB error,', async () => {
      Profiles.findById.mockResolvedValue({
        id: '200',
        name: 'Suzanne Collins',
        email: 'suzanne@example.com',
      });
      Connections.findByProfileId.mockRejectedValue(new Error('DB error'));
      const res = await request(server).get('/connect/profile/200');

      expect(res.status).toBe(500);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe('DB error');
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to GET profile-book connections with profile id 200.'
      );
      expect(Profiles.findById.mock.calls.length).toBe(4);
      expect(Connections.findByProfileId.mock.calls.length).toBe(3);
    });
  });

  describe('POST /connect', () => {
    it('should return 200 when profile-book connection is created', async () => {
      const connection = {
        profileId: 11,
        bookId: 2,
        readingStatus: 2,
      };
      Connections.duplicateCheck.mockResolvedValue(undefined);
      Connections.create.mockResolvedValue(
        Object.assign({ id: 122 }, connection)
      );
      const res = await request(server).post('/connect').send(connection);

      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe('profile-book connection created');
      expect(res.status).toBe(200);
      expect(res.body.connection).toBeTruthy();
      expect(res.body.connection.id).toBe(122);
      expect(res.body.connection.profileId).toBe(11);
      expect(res.body.connection.bookId).toBe(2);
      expect(res.body.connection.readingStatus).toBe(2);
      expect(Connections.duplicateCheck.mock.calls.length).toBe(1);
      expect(Connections.create.mock.calls.length).toBe(1);
    });

    it('should return 400 when profile-book connection is missing in request body', async () => {
      Connections.duplicateCheck.mockResolvedValue(undefined);
      Connections.create.mockResolvedValue();
      const res = await request(server).post('/connect').send();

      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to create profile-book connection because info is missing in request body.'
      );
      expect(res.status).toBe(400);
      expect(Connections.duplicateCheck.mock.calls.length).toBe(1);
      expect(Connections.create.mock.calls.length).toBe(1);
    });

    it('should return 400 when profile-book connection already exists', async () => {
      const connection = {
        profileId: 11,
        bookId: 2,
        readingStatus: 2,
      };
      Connections.duplicateCheck.mockResolvedValue(
        Object.assign({ id: 122 }, connection)
      );
      const res = await request(server).post('/connect').send(connection);

      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Profile-book connection with id 122 already exists'
      );
      expect(res.body.message).not.toBe(
        'Profile-book connection with id 20 already exists'
      );
      expect(res.status).toBe(400);
      expect(Connections.duplicateCheck.mock.calls.length).toBe(2);
      expect(Connections.create.mock.calls.length).toBe(1);
    });

    it('should return 500 when profile-book connection is unable to be created due to DB error', async () => {
      const connection = {
        profileId: 11,
        bookId: 2,
        readingStatus: 2,
      };
      Connections.duplicateCheck.mockResolvedValue(undefined);
      Connections.create.mockRejectedValue(new Error('DB error'));
      const res = await request(server).post('/connect').send(connection);

      expect(res.status).toBe(500);
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe('DB error');
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to create profile-book connection'
      );
      expect(Connections.duplicateCheck.mock.calls.length).toBe(3);
      expect(Connections.create.mock.calls.length).toBe(2);
    });
  });

  describe('PUT /connect/:id', () => {
    it('should return 200 when profile-book connection is successfully modified', async () => {
      const requestBody = {
        favorite: true,
      };
      const connection = {
        id: 122,
        profileId: 11,
        bookId: 2,
        readingStatus: 2,
      };
      const updatedConnection = Object.assign(requestBody, connection);
      Connections.findById.mockResolvedValue(connection);
      Connections.update.mockResolvedValue(updatedConnection);
      const res = await request(server).put('/connect/122').send(requestBody);

      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Profile-book connection with id 122 is updated.'
      );
      expect(res.status).toBe(200);
      expect(res.body.connection).toBeTruthy();
      expect(res.body.connection.id).toBe(122);
      expect(res.body.connection.profileId).toBe(11);
      expect(res.body.connection.bookId).toBe(2);
      expect(res.body.connection.readingStatus).toBe(2);
      expect(res.body.connection.favorite).toBe(true);
      expect(Connections.findById.mock.calls.length).toBe(4);
      expect(Connections.update.mock.calls.length).toBe(1);
    });

    it('should return 400 when profile-book connection is not successfully modified because body is missing', async () => {
      const res = await request(server).put('/connect/122').send();
      expect(res.status).toBe(400);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to update profile-book connection with id 122 because request body is missing.'
      );
      expect(Connections.findById.mock.calls.length).toBe(4);
      expect(Connections.update.mock.calls.length).toBe(1);
    });

    it('should return 400 when profile-book connection is not successfully modified because profile-book connection is not found', async () => {
      const requestBody = {
        favorite: true,
      };
      Connections.findById.mockResolvedValue(undefined);
      const res = await request(server).put('/connect/122').send(requestBody);
      expect(res.status).toBe(400);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to update profile-book connection because profile-book connection with id 122 was not found.'
      );
      expect(Connections.findById.mock.calls.length).toBe(5);
      expect(Connections.update.mock.calls.length).toBe(1);
    });

    it('should return 404 when profile-book connection is not successfully modified because profile-book connection id is missing', async () => {
      const requestBody = {
        favorite: true,
      };

      const res = await request(server).put('/connect/').send(requestBody);
      expect(res.status).toBe(404);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBeTruthy();
      expect(res.error.text).toEqual(
        expect.stringContaining('<pre>Cannot PUT /connect/</pre>\n')
      );
      expect(res.error.text).toEqual(
        expect.stringContaining('<title>Error</title>\n')
      );
      expect(Connections.findById.mock.calls.length).toBe(5);
      expect(Connections.update.mock.calls.length).toBe(1);
    });

    it('should return 500 when profile-book connection is not successfully updated, due to DB errors', async () => {
      const requestBody = {
        favorite: true,
      };
      const connection = {
        id: 122,
        profileId: 11,
        bookId: 2,
        readingStatus: 2,
      };

      Connections.findById.mockResolvedValue(connection);
      Connections.update.mockRejectedValue(new Error('DB error'));

      const res = await request(server).put('/connect/122').send(requestBody);
      expect(res.status).toBe(500);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to update profile-book connection with id 122'
      );
      expect(res.body.error).toBeTruthy();
      expect(res.body.error).toBe('DB error');

      expect(Connections.findById.mock.calls.length).toBe(6);
      expect(Connections.update.mock.calls.length).toBe(2);
    });
  });

  describe('DELETE /connect/:id', () => {
    it('should return 200 when profile-book connection is successfully deleted', async () => {
      const connection = {
        id: 122,
        profileId: 11,
        bookId: 2,
        readingStatus: 2,
      };
      Connections.findById.mockResolvedValue(connection);
      Connections.remove.mockResolvedValue(1);
      const res = await request(server).delete('/connect/122');
      expect(res.status).toBe(200);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Profile-book connection with id 122 was deleted.'
      );
      expect(res.body.count_of_deleted_connections).toBeTruthy();
      expect(res.body.count_of_deleted_connections).toBe(1);

      expect(Connections.findById.mock.calls.length).toBe(7);
      expect(Connections.remove.mock.calls.length).toBe(1);
    });

    it('should return 404 when profile-book connection is not successfully deleted because profile-book connection was not found', async () => {
      Connections.findById.mockResolvedValue(undefined);

      const res = await request(server).delete('/connect/1222');
      expect(res.status).toBe(404);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Unable to delete profile-book connection because profile-book connection with id 1222 not found.'
      );
      expect(Connections.findById.mock.calls.length).toBe(8);
      expect(Connections.remove.mock.calls.length).toBe(1);
    });

    it('should return 500 when profile-book connection is not successfully deleted because of DB error', async () => {
      const connection = {
        id: 122,
        profileId: 11,
        bookId: 2,
        readingStatus: 2,
      };
      Connections.findById.mockResolvedValue(connection);
      Connections.remove.mockRejectedValue(new Error('DB error'));
      const res = await request(server).delete('/connect/122');
      expect(res.status).toBe(500);
      expect(res.body.message).toBeTruthy();
      expect(res.body.message).toBe(
        'Failure to delete profile-book connection with id 122'
      );
      expect(res.body.error).toBeTruthy();
      expect(Connections.findById.mock.calls.length).toBe(9);
      expect(Connections.remove.mock.calls.length).toBe(2);
    });
  });
});
