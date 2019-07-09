const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true    
});


// const task = new Task({
//     description: '   Finish Course    '
// });

// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error);
// })