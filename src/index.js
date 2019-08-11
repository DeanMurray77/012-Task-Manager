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

const multer = require('multer');

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a Word document'));
        }

        cb(undefined, true);
    }
})

const errorMiddleware = (req, res, next) => {
    throw new Error("This isn't working");
}

app.post('/upload', errorMiddleware, (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.status(400).send();
})