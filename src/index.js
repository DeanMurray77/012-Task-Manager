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

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        res.status(201).send(user);
    }).catch((error) => {
        res.status('400').send(error);
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task);
    }).catch((error) => {
        res.status('400').send(error);
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((error) => {
        res.status(500).send();
    })
})

app.listen(port, () => {
    console.log("Server is up on port " + port);
})