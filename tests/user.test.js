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
    const response = await request(app).post('/users').send({
        name: 'Dean Murray',
        email: 'dean@dean.com',
        password: 'MyPass777!'
    }).expect(201);

    //Assert that the databese was changed correctly:
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Dean Murray',
            email: 'dean@dean.com'
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe('MyPass777!');
});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(userOneId);

    expect(user.tokens[1].token).toBe(response.body.token);
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

    //confirm that there is no longer any such user with that ID in the database
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

test('Should upload an avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg');

        expect(200);
})