const express = require('express');

require('./db/mongoose'); //ensures that mongoose.js runs and we connect to the db

// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// Options
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('', (req, res) => {
    res.send("Nothing here, but it's working...");
})

app.listen(port, () => {
    console.log("Server is up on port " + port);
})

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    // const task = await Task.findById('5d3cd4acac58f19c071ca01a');
    // console.log(task);
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    const user = await User.findById('5d3cf9584fc69d9f3cbcb778');

    console.log(user);

    await user.populate('tasks').execPopulate();
    console.log(user.tasks);
}

main();