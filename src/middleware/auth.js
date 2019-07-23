const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ", '');
        console.log("Token: " + token);
        const isMatch = jwt.verify(token, 'secret');
        console.log("Is match? " + JSON.stringify(isMatch));
        next();        
    } catch (e) {
        res.status(401).send({error: 'Please authenticate'});
    }
}

module.exports = auth