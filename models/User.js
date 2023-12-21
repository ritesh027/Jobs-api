const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please Provied Name'],
        minlength: 3,
        maxlength: 50,
    },
    email:{
        type: String,
        required: [true, 'Please Provied email'],
        match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        , 'Please Provide valid email'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Please Provied password'],
        minlength: 3,
    },
})

UserSchema.pre('save', async function (next){
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.createJWT = function() {
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bycrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);