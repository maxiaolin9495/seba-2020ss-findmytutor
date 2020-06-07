const jwt = require('jsonwebtoken');
const customerModel = require('../models/customer');
const tutorModel = require('../models/tutor');
const config = require('../config');



const login = (req, res) => {

    let verificationResult = verifyRequestBody(req);

    if (!verificationResult.ifValid) {
        return res.status(400).json(verificationResult.message);
    }

    if (req.body.userType === "customer") {

        return findUser(req, res, customerModel);

    } else {

        return findUser(req, res, tutorModel);

    }

};

const register = (req, res) => {
    let verificationResult = verifyRequestBody(req);

    if (!verificationResult.ifValid) {

        return res.status(400).json(verificationResult.message);

    }

    if (req.body.userType === "tutor") {

        const user = Object.assign(req.body, {ifProved: false});
        return registerUser(user, customerModel, tutorModel, req, res);

    } else {

        const user = Object.assign(req.body);
        return registerUser(user, tutorModel, customerModel, req, res);

    }

};

const registerUser = (user, dataModel1, dataModel2, req, res) => {
    dataModel1.findOne({email: req.body.email}).exec()
        .then(data => {
            //verify if the email is registered in the dataModel1
            if (data === null) {
                //if not, then try to register the email in the dataModel2
                dataModel2.create(user).then(user => {

                    // if user is registered without errors
                    // create a token
                    return createTokenResponse(req, res, user);

                })
                    .catch(error => {
                        return errorHandlerForRegister(error, res);
                    });
            } else {
                return res.status(400).json({
                    error: 'Duplicated user',
                    message: 'You have already registered an account with your email'
                })
            }
        }).catch(error => {
        console.log('error by searching user ' + error);
        return res.status(404).json({
            error: 'User Not Found',
            message: error.message
        })
    });
};

const findUser = (req, res, dataModel) => {
    dataModel.findOne({email: req.body.email}).exec()//customerModel schema
        .then(user => {//user object

            // check if the password is valid
            if (!(req.body.password === user.password)) return res.status(401).send({token: null});

            return createTokenResponse(req, res, user);

        })
        .catch(error => {
            console.log('error by searching user');
            return res.status(404).json({
                error: 'User Not Found',
                message: error.message
            })
        });
};


const createTokenResponse = (req, res, user) => {

    // sign a token
    const token = jwt.sign({
        email: user.email,
        userType: req.body.userType
    }, config.JwtSecret, {
        expiresIn: 999999,
    });
    return res.status(200).json({token: token})
};

const errorHandlerForRegister = (error, res) => {
    console.log('error by creating a User');
    if (error.code === 11000) {
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
};

const verifyRequestBody = (req) =>{
    if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) {
        return {
            ifValid: false,
            message: {
                error: 'Bad Request',
                message:
                    'The request body must contain a password property'
            }
        };
    }

    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) {
        return {
            ifValid: false,
            message: {
                error: 'Bad Request',
                message: 'The request body must contain a email property'
            }
        };
    }

    if (!Object.prototype.hasOwnProperty.call(req.body, 'userType')) {
        return {
            ifValid: false,
            message: {
                error: 'Bad Request',
                message: 'The request body must contain a userType property'
            }
        };
    }

    // only 2 valid userType values
    if (req.body.userType !== "tutor" && req.body.userType !== "customer") {
        return {
            ifValid: false,
            message: {
                error: 'Bad Request',
                message: 'Invalid userType value'
            }
        };
    }

    return {
        ifValid: true
    }

};

module.exports = {
    login,
    register,
};
