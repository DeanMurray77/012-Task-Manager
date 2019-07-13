require('../src/db/mongoose');
const User = require('../src/models/user');

Promise chaining method:
User.findByIdAndUpdate('5d2516ee80821e2feb1f15bc', {age: 1}).then((user) => {
    console.log(user);
    return User.countDocuments({age: 1});
}).then((result) => {
    console.log(`Number of documents with age 1: ${result}`);
}).catch((e) => {
    console.log(e);
})

//Async-Await method
const updateUserAgeByID = async (id, newAge) => {
    const user = await User.findByIdAndUpdate(id, {age: newAge});
    const matchingDocuments = await User.countDocuments({age: newAge});
    return matchingDocuments;
}

updateUserAgeByID('5d2517e6ad3f353003fffe3d', 10).then((result) => {
    console.log(`Number of documents with matching age: ${result}`);
}).catch((e) => {
    console.log(e);
})