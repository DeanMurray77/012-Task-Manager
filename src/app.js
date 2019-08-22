const express = require('express');

require('./db/mongoose'); //ensures that mongoose.js runs and we connect to the db

// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// Options
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;