const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

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
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer));
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "John Doe",
            email: "John@example.com"
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
})

test('Should fail to update invalid field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Nowhere"
        })
        .expect(400);
})

test('Should fail to update valid field on unauthorized user', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: "Bob"
        })
        .expect(401);
})

test('Should fail to signup user with invalid name/email/password', async () => {
    //Invalid (missing) name:
    await request(app)
        .post('/users')
        .send({
            name: "",
            email: "dave@example.com",
            password: "ThisIsAValidPass123##$"
        })
        .expect(400);

    //Invalid email:
    await request(app)
        .post('/users')
        .send({
            name: "Bob Johnson",
            email: "Bob@Bob@Bob",
            password: "ThisIsAValidPass123##$"
        })
        .expect(400);

    //Missing email:
    await request(app)
        .post('/users')
        .send({
            name: "Bob Johnson",
            email: "",
            password: "ThisIsAValidPass123##$"
        })
        .expect(400);

    //Missing password:
    await request(app)
        .post('/users')
        .send({
            name: "David Nameless",
            email: "dave@example.com",
            password: ""
        })
        .expect(400);

    //Invalid password (too short):
    await request(app)
        .post('/users')
        .send({
            name: "David Nameless",
            email: "dave@example.com",
            password: "aoeuid"
        })
        .expect(400);

    //Invalid password (contains 'password'):
    await request(app)
        .post('/users')
        .send({
            name: "David Nameless",
            email: "dave@example.com",
            password: "Password12345%$#"
        })
        .expect(400);
})

// User Test Ideas
//
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated