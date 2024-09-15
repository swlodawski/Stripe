const mongoose = require('mongoose');

const { Schema } = mongoose;
const brcypt = require('bcrypt');
const Order = require('./Order');
const { use } = require('chai');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    orders: [Order.schema]
});

userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await brcypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function(password) {
    return await brcypt.compare(password, thisPassword);
};

const User = mongoose('User', userSchema);

module.exports = User;