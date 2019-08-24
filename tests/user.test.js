const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name: 'Mike Jones',
    email: 'mike@mike.com',
    password: '567What!!!'
};

beforeAll(async () => {
    await User.deleteMany(); //no arguments means that it deletes all records
    await new User(userOne).save();
});

test('Should sign up a new user', async () => {
    await request(app).post('/users').send({
        name: 'Dean Murray',
        email: 'dean@dean.com',
        password: 'MyPass777!'
    }).expect(201);
});

test('Should login existing', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
});

test('Should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'nonExistentUSer@test.com',
        password: 'SomethingFake'
    }).expect(400);
});

test('Should not login user with empty creds', async () => {
    await request(app).post('/users/login').send({
    }).expect(400);
});

test('Should not login valid user with empty password', async () => {
    await request(app).post('/users/login').send({
        email: userOne.password
    }).expect(400);
});

test('Should not login valid user with invalid password', async () => {
    await request(app).post('/users/login').send({
        email: userOne.password,
        password: 'bogusPassword'
    }).expect(400);
});