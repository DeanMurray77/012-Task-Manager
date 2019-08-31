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

test('Should fetch only incomplete tasks & sort by description', async () => {
    const response = await request(app)
        .get('/tasks?completed=false&sortBy=description_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2)
    expect(response.body[0]._id).toBe(taskFour._id.toString());
    expect(response.body[1]._id).toBe(taskOne._id.toString());
})

// Task Test Ideas
// 
// 

// 
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks