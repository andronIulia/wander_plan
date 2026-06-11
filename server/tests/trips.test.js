const request = require('supertest');
const app = require('../index');

describe('Trip Routes', () => {
  describe('GET /api/trips', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/trips');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/trips', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).post('/api/trips').send({
        title: 'Paris Trip',
        destination: 'Paris',
        startDate: '2025-06-01',
        endDate: '2025-06-10',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/trips/:id', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).delete('/api/trips/some-id');
      expect(res.status).toBe(401);
    });
  });
});
