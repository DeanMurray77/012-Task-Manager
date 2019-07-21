const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email address is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("The password must not contain 'password'");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function () {
    //You can't use an arrow function because it's a method...
    
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, 'secret', { expiresIn: '1 day' } );

    user.tokens = user.tokens.concat({ token }); //token is a string, so we have to make it an object.
    //.push should have worked, but mongoose fumbles that for some reason...

    await user.save();
    return token;        
}

userSchema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({email: email});

    if(!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
}

// Hash plaintext passwork middleware
userSchema.pre('save', async function (next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }    

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;