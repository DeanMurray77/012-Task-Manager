const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');

const {
    userOne,
    userOneId,
    userTwo,
    userTwoId, 
    taskOne,
    taskTwo,
    taskThree,
    taskFour,
    taskFive,
    setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Create a task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Task from my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
})

test('Get all tasks (4) for userOne', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(4);
})

test("Should fail to delete userOne's task while logged in as userTwo", async () => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})

test("Should delete userOne's task while correctly authenticated", async () => {
    const response = await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();
    expect(response.body._id).toEqual(taskOne._id.toString());
})

test("Should fail to delete userOne's task while not authenticated", async () => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .send()
        .expect(401)

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})

test('Should not create task with invalid description/completed', async () => {
    //Missing description
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ""
        })
        .expect(400);

    //Invalid completed
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'maybe'
        })
        .expect(400);
})

test("Should not update task with invalid description/completed", async () => {
    //Invalid (Missing) description
    await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ""
        })
        .expect(400)

    //Invalid complete
    await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: "Yes"
        })
        .expect(400)
})

test("Should not update other users task", async () => {
    //Invalid (Missing) description
    await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: "Something New"
        })
        .expect(404)

    //Confirm database hasn't been changed...
    const task = await Task.findById(taskOne._id)
    expect(task.description).not.toEqual('Something New')
})

test('Should fetch user task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body).toMatchObject({
        completed: false,
        _id: taskOne._id.toString(),
        description: "First task from prepopulated data",
        owner: userOneId.toString()
    });
})

test('Should not fetch user task by id if not authenticated', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .send()
        .expect(401);
})

test('Should not fetch other users task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404);
})

test('Should fetch only incomplete tasks & sort by description (descending)', async () => {
    const response = await request(app)
        .get('/tasks?completed=false&sortBy=description_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2)
    expect(response.body[0]._id).toBe(taskFour._id.toString());
    expect(response.body[1]._id).toBe(taskOne._id.toString());
})

test('Should fetch only completed tasks & sort by description (ascending)', async () => {
    const response = await request(app)
        .get('/tasks?completed=true&sortBy=description_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2)
    expect(response.body[0]._id).toBe(taskFive._id.toString());
    expect(response.body[1]._id).toBe(taskTwo._id.toString());
})

test('Should sort tasks by completed (ascending)', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=completed_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(4);
    expect(response.body[0]._id).toBe(taskOne._id.toString());
    expect(response.body[1]._id).toBe(taskFour._id.toString());
    expect(response.body[2]._id).toBe(taskTwo._id.toString());
    expect(response.body[3]._id).toBe(taskFive._id.toString());
})

test('Should sort tasks by completed (descending)', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=completed_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(4);
    expect(response.body[0]._id).toBe(taskTwo._id.toString());
    expect(response.body[1]._id).toBe(taskFive._id.toString());
    expect(response.body[2]._id).toBe(taskOne._id.toString());
    expect(response.body[3]._id).toBe(taskFour._id.toString());
})

test('Should sort tasks by createdAt (descending)', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=createdAt_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body[0]._id).toBe(taskFive._id.toString());
    expect(response.body[1]._id).toBe(taskFour._id.toString());
    expect(response.body[2]._id).toBe(taskTwo._id.toString());
    expect(response.body[3]._id).toBe(taskOne._id.toString());
})

test('Should sort tasks by createdAt (ascending)', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=createdAt_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body[0]._id).toBe(taskOne._id.toString());
    expect(response.body[1]._id).toBe(taskTwo._id.toString());
    expect(response.body[2]._id).toBe(taskFour._id.toString());
    expect(response.body[3]._id).toBe(taskFive._id.toString());
})

test('Should sort tasks by updatedAt (ascending)', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=updatedAt_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body[0]._id).toBe(taskOne._id.toString());
    expect(response.body[1]._id).toBe(taskTwo._id.toString());
    expect(response.body[2]._id).toBe(taskFour._id.toString());
    expect(response.body[3]._id).toBe(taskFive._id.toString());
})

test('Should sort tasks by updatedAt (descending)', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=updatedAt_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body[0]._id).toBe(taskFive._id.toString());
    expect(response.body[1]._id).toBe(taskFour._id.toString());
    expect(response.body[2]._id).toBe(taskTwo._id.toString());
    expect(response.body[3]._id).toBe(taskOne._id.toString());
})

test('Should fetch a page of 2 tasks', async () => {
    const response = await request(app)
        .get('/tasks?limit=2')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0]._id).toBe(taskOne._id.toString());
    expect(response.body[1]._id).toBe(taskTwo._id.toString());
})

test('Should fetch a page of 2 tasks, skipping the first two responses', async () => {
    const response = await request(app)
        .get('/tasks?limit=2&skip=2')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0]._id).toBe(taskFour._id.toString());
    expect(response.body[1]._id).toBe(taskFive._id.toString());
})