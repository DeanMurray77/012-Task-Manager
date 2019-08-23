const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
    console.log('Before each')
})

afterEach(() => {
    console.log('After each')
})

test('Should sign up a new user', async () => {
    await request(app).post('/users').send({
        name: 'Dean Murray',
        email: 'dean@dean.com',
        password: 'MyPass777!'
    }).expect(201);
})