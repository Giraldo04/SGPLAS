// backend/__tests__/server.test.js
const request = require('supertest');
const server = require('../server'); // Importa el servidor real

afterAll((done) => {
  server.close(done); // Cierra el servidor al finalizar los tests
});

describe('GET /', () => {
  it('debería responder con "Bienvenido a ImportadoraSGPlas API"', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Bienvenido a ImportadoraSGPlas API');
  });
});
