const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true    
});



// const me = new User({
//     name: '  Peter    ',
//     email: '    a@a.com    ',
//     password: '       1234567898     '
// });

// me.save().then((result) => {
//     console.log(me);
// }).catch((error) => {
//     console.log(error);
// });

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// const task = new Task({
//     description: '   Finish Course    '
// });

// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error);
// })