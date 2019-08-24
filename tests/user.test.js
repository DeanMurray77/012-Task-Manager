const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: 'Mike Jones',
    email: 'mike@mike.com',
    password: '567What!!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
};

beforeEach(async () => {
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

test("Should get a user's profile", async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile when no authentication is provided", async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test("Should fail to delete unauthenticated user", async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401); //Fails at authentication before getting into the route
})

test('Should delete user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200);
})