const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true    
});

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email address is invalid');
            }
        }
    }
});

const me = new User({
    name: 'Peter',
    age: 15,
    email: 'a@a.com'
});

me.save().then((result) => {
    console.log(me);
}).catch((error) => {
    console.log(error);
});

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true
//     },
//     completed: {
//         type: Boolean
//     }
// })

// const task = new Task({description: 'Find House', completed: false});

// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error);
// })