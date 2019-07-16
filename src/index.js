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

const bcrypt = require('bcryptjs');

const myFunction = async () => {
    const password = 'red12345';
    const hashedPassword = await bcrypt.hash(password, 8);

    console.log(password);
    console.log(hashedPassword);

    const isMatch = await bcrypt.compare('red1a2345', hashedPassword);
    console.log(isMatch);
}

myFunction();