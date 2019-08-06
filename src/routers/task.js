const express = require('express');
const router = new express.Router();

const auth = require('../middleware/auth');

// Import Model
const Task = require('../models/task');

// Create a new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

// Return a list of all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);        
    } catch (error) {
        res.status(500).send();
    }
})

// Return a single item based on item id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        
        if(!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
})

// Update a task
router.patch('/tasks/:id', auth, async (req, res) => {
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
        const task = await Task.findOne({ _id, owner: req.user._id });

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
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

        if(!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send(e);        
    }
})

module.exports = router;