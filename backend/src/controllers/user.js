const jwt = require('jsonwebtoken');
const userModel = require('../models/loginPassword');
const config = require('../config');



const login = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a password property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });

    userModel.findOne({email: req.body.email}).exec()//UseModel schema
        .then(user => {//user object
            // check if the password is valid
            if (!(req.body.password === user.password)) return res.status(401).send({token: null});

            const token = jwt.sign({
                email: user.email,
                userType: user.userType,
                withProfile: user.withProfile
            }, config.JwtSecret, {
                expiresIn: 999999,
            });
            return res.status(200).json({token: token})

        })
        .catch(error => {
            console.log('error by searching user')
            return res.status(404).json({
                error: 'User Not Found',
                message: error.message
            })
        });

};

const register = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a password property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });

    const user = Object.assign(req.body);
    userModel.create(user)
        .then(user => {

            // if user is registered without errors
            // create a token
            const token = jwt.sign({id: user._id, email: user.email}, config.JwtSecret, {
                expiresIn: 999999 // time in seconds until it expires
            });

            return res.status(200).json({token: token});

        })
        .catch(error => {
            console.log('error by creating a User');
            if (error.code == 11000) {
                return res.status(400).json({
                    error: 'User exists',
                    message: error.message
                })
            } else {
                return res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                })
            }
        });

};



module.exports = {
    login,
    register,
};
