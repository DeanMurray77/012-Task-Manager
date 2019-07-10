require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('5d2516ee80821e2feb1f15bc', {age: 1}).then((user) => {
    console.log(user);
    return User.countDocuments({age: 1});
}).then((result) => {
    console.log(`Number of documents with age 1: ${result}`);
}).catch((e) => {
    console.log(e);
})