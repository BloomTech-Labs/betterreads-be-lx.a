const request = require('supertest');
const express = require('express');
const Books = require('../../api/models/bookModel');
const bookRouter = require('../../api/routes/books');
const server = express();

jest.mock('../../api/models/bookModel');

describe('books router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/books', bookRouter);
  });

  describe('GET /books', () => {
    it('should return 200', async () => {
      Books.findAll.mockResolvedValue([]);
      const res = await request(server).get('/books');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(Books.findAll.mock.calls.length).toBe(1);
    });
  });

  describe('GET /books/:id', () => {
    it('should return 200 when book found', async () => {
      Books.findById.mockResolvedValue({
        id: 20,
        googleId: 'kPmLDQAAQBAJ',
        title: 'The Martian',
        authors: 'Andy Weir',
      });
      const res = await request(server).get('/books/20');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('The Martian');
      expect(res.body.googleId).toBe('kPmLDQAAQBAJ');
      expect(res.body.authors).toBe('Andy Weir');
      expect(Books.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no book found', async () => {
      Books.findById.mockResolvedValue();
      const res = await request(server).get('/books/20');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('BookNotFound');
    });
  });
});
