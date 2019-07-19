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

const jwt = require('jsonwebtoken');

const myFunction = async () => {
    const token = jwt.sign({ _id: 'abcd123' }, 'thisIsMyNewToken', { expiresIn: '1 seconds'});
    console.log(token);

    let isMatch = jwt.verify(token, 'thisIsMyNewToken');
    console.log(isMatch);
}

myFunction();