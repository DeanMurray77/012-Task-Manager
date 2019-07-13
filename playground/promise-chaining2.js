require('../src/db/mongoose');
const Task = require('../src/models/task');

// Promise Chaining method:
// Task.findByIdAndDelete('5d2520c68245b933312a5d5a').then((task) => {
//     console.log(task);
//     return Task.countDocuments({"completed": false});
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// })

// Async-Await method:
const deleteByIdAndCountIncomplete = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    return await Task.countDocuments({"completed": false});
}

deleteByIdAndCountIncomplete('5d2a5d2bd93ea29aa081a23a').then((result) => {
    console.log("Number of Incomplete Tasks: " + result);
}).catch((e) => {
    console.log("Error: ", e);
})