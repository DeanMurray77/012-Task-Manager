const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user')

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

const setupDatabase = async () => {
    await User.deleteMany(); //no arguments means that it deletes all records
    await new User(userOne).save();
}

module.exports = {
    userOne,
    userOneId,
    setupDatabase
}