const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Jenny Doe',
    email: 'Jenny@example.com',
    password: 'ThisIsAPass453$$%',
    tokens: [{
        token: jwt.sign({ _id: userTwoId}, process.env.JWT_SECRET)
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First task from prepopulated data",
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second task from prepopulated data",
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Third task from prepopulated data (goes to 2nd user)",
    completed: false,
    owner: userTwo._id
}

const taskFour = {
    _id: new mongoose.Types.ObjectId(),
    description: "Fourth task from prepopulated data",
    completed: false,
    owner: userOneId
}

const taskFive = {
    _id: new mongoose.Types.ObjectId(),
    description: "Fifth task from prepopulated data",
    completed: true,
    owner: userOneId
}

const setupDatabase = async () => {
    await User.deleteMany(); //no arguments means that it deletes all records
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
    await new Task(taskFour).save();
    await new Task(taskFive).save();
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    taskFour,
    taskFive,
    setupDatabase,
}