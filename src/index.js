const express = require('express');

require('./db/mongoose'); //ensures that mongoose.js runs and we connect to the db
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('', (req, res) => {
    res.send("Nothing here, but it's working...");
})

// Create a new user
app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

// Return a list of users
app.get('/users', async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send();        
    }
})

// Return a single user by id
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if(!user) {
            return res.status(404).send();
        }

        res.send(user);

    } catch (error) {
        res.status(500).send();
    }
})

// Update a user
app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send(`Illegal update attribute passed. Allowed attributes are: ${allowedUpdates}`);
    }

    const _id = req.params.id;

    try {
        const newUser = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true});

        if(!newUser) { // No such user to update
            return res.status(404).send();
        }

        res.send(newUser); // Successful update
    } catch (e) { // Validation error, or database connection error
        res.status(400).send();
    }
})

// Create a new task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

// Return a list of all tasks
app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);        
    } catch (error) {
        res.status(500).send();
    }
})

// Return a single item based on item id
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);
        
        if(!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
})

app.listen(port, () => {
    console.log("Server is up on port " + port);
})