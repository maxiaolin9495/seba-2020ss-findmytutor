"use strict";

//Configuration variables
const port      = process.env.PORT        || '3000';
const mongoURI  = process.env.MONGODB_URI || 'mongodb://localhost:27017/mongodb';
const JwtSecret = process.env.JWT_SECRET  || 'very secret secret';
const gmailAccount = process.env.gmailAccount || 'findmytutor2020@gmail.com';
const gmailPassword = process.env.gmailPassword || 'Zxcv12345';

module.exports = {
    port,
    JwtSecret,
    mongoURI,
    gmailAccount,
    gmailPassword
};
