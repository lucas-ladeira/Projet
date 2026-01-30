const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name']
    },
    email: {
        type: String,
        required: [true, 'Please enter the email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter the password']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    if (!this.getUpdate().password)
        return next();
    this.getUpdate().password = await bcrypt.hash(this.getUpdate().password, 10);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;