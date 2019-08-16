const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ", '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //returns the id, iat and exp if decodes
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        
        if(!user) {
            throw new Error();
        }

        req.user = user; //so route doesn't have to lookup the user
        req.token = token; //so logout route knows which token to delete
        next();
    } catch (e) {
        res.status(401).send({error: 'Please authenticate'});
    }
}

module.exports = auth