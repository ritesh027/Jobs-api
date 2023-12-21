const User = require('../models/User')
const jwt = require('jsonwebtoken');
const {CustomAPIError, UnauthenticatedError} = require('../errors');

const auth = async (req, res, next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        throw new UnauthenticatedError('Invalid Token');
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: decoded.userId, name: decoded.name};
        next();
    }
    catch(error)
    {
        throw new UnauthenticatedError('Invalid Token');
    }
}

module.exports = auth;