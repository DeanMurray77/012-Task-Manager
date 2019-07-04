const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewURLParser: true,
    useCreateIndex: true    
});

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});