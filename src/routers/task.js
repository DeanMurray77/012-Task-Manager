const express = require('express');
const router = new express.Router();

const auth = require('../middleware/auth');

// Import Model
const Task = require('../models/task');

// Create a new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
       owner: req.user._id,
       description: req.body.description,
       completed: req.body.completed 
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

// Return a list of all tasks
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);        
    } catch (error) {
        res.status(500).send();
    }
})

// Return a single item based on item id
router.get('/tasks/:id', async (req, res) => {
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

// Update a task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValidOperation) {
        let message = "Error: Illegal update attribute passed. ";
        message += "Allowed attributes are: ";
        message += allowedUpdates;
        return res.status(400).send(message);
    }

    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);

        if(!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        })

        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send();
    }
})

//Delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findByIdAndDelete(_id);

        if(!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send(e);        
    }
})

module.exports = router;