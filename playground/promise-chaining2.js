require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5d2520c68245b933312a5d5a').then((task) => {
    console.log(task);
    return Task.countDocuments({"completed": false});
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})