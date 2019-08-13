const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
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
       const user = await User.findByCredential(req.body.email, req.body.password);
        // An error is thrown by findByCredential if the user can't be matched and password confirmed

        const token = await user.generateAuthToken();

        res.send( { user, token } ); //Temp solution. Needs changed.

    } catch (e) {
        res.status(400).send();
    }
})

// Log out a user (1 token removed)
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

// Log out a user (all tokens removed)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})


// Return user's profile
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send();        
    }
})

// Update user's profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];

    const isValidOperation = updates.every((update) => {
        //!isValidOperation unless all items in updates is in allowedUpdates.
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send(`Illegal update attribute passed. Allowed attributes are: ${allowedUpdates}`);
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })

        await req.user.save();

        res.send(req.user); // Successful update
    } catch (e) { // Validation error, or database connection error
        res.status(400).send();
    }
})

// Delete a user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/.(jpeg|jpg|png)$/)) {
            return cb(new Error('File must be a picture (.jpg, .jpeg or .png).'));
        }
        
        cb(undefined, true)
    }
})

// Add user avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ 
        height: 250,
        width: 250
    }).png().toBuffer();

    req.user.avatar = buffer;

    await req.user.save();
    
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();

    res.send();
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
})

module.exports = router;