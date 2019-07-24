const express = require('express');
const router = new express.Router();

const auth = require('../middleware/auth');

// Import Model
const User = require('../models/user');

// Create a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

// Authenticate (log in) a user
router.post('/users/login', async (req, res) => {
    try {
        req.user
        
        const user = await User.findByCredential(req.body.email, req.body.password);
        // An error is thrown by findByCredential if the user can't be matched and password confirmed

        const token = await user.generateAuthToken();

        res.send( {user, token} ); //Temp solution. Needs changed.

    } catch (e) {
        res.status(400).send();
    }
})

// Log out a user:
router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

// Return a list of users
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send();        
    }
})

// Return a single user by id
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];

    const isValidOperation = updates.every((update) => {
        //!isValidOperation unless all items in updates is in allowedUpdates.
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send(`Illegal update attribute passed. Allowed attributes are: ${allowedUpdates}`);
    }

    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if(!user) { // No such user to update
            return res.status(404).send();
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        })

        await user.save();

        res.send(user); // Successful update
    } catch (e) { // Validation error, or database connection error
        res.status(400).send();
    }
})

// Delete a user
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(_id);

        if(!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;