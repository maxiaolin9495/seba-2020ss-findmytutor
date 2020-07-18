const jwt = require('jsonwebtoken');
const customerModel = require('../models/customerModel');
const tutorModel = require('../models/tutorModel');
const config = require('../config');
const tutorialModel = require('../models/tutorialModel');
const reviewModel = require('../models/reviewModel');
const emailService = require('../services/emailService');

const login = (req, res) => {

    let verificationResult = verifyRequestBody(req);

    if (!verificationResult.ifValid) {
        return res.status(400).json(verificationResult.message);
    }
    tutorModel.findOne({ email: req.body.email.trim().toLowerCase() }).exec()
        .then(user => {
            //user object
            if(!user){
                customerModel.findOne({
                    email: req.body.email.trim().toLowerCase()
                })
                    .exec()
                    .then(user => {
                        //user object
                        // check if the password is valid
                        if (!(req.body.password === user.password)){

                            return res.status(401).send({ token: null });

                        }
                        return createTokenResponse(req, res, user, 'customer');

                    })
            }else {
                // check if the password is valid
                if (!(req.body.password === user.password)) {
                    return res.status(401)
                        .send({
                            token: null
                        });
                }

                return createTokenResponse(req, res, user, 'tutor');

            }
        })
        .catch(error => {
            console.log('error by searching user');
            return res.status(500).json({
                error: 'Internal Error happened',
                message: error.message
            })
        });
};

const register = (req, res) => {
    let verificationResult = verifyRequestBody(req);

    if (!verificationResult.ifValid) {

        return res.status(400).json(verificationResult.message);

    }

    if (req.body.userType === "tutor") {

        const user = Object.assign(req.body, { ifProved: false });
        //the email address will be transformed to lowerCase;
        user.email = user.email.trim().toLowerCase();
        return registerUser(user, customerModel, tutorModel, req, res);

    } else {

        const user = Object.assign(req.body);
        user.email = user.email.trim().toLowerCase();
        return registerUser(user, tutorModel, customerModel, req, res);

    }

};

const registerUser = (user, dataModel1, dataModel2, req, res) => {
    dataModel1.findOne({ email: req.body.email.trim().toLowerCase() }).exec()
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
            console.log('error by searching user ' + error.message);
            return res.status(404).json({
                error: 'User Not Found',
                message: error.message
            })
        });
};


const createTokenResponse = (req, res, user, userType) => {

    // sign a token
    const token = jwt.sign({
        email: user.email,
        userType: userType?userType:req.body.userType
    }, config.JwtSecret, {
        expiresIn: 999999,
    });
    return res.status(200).json({ token: token })
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

const verifyRequestBody = (req) => {
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

    // only 2 valid userType values
    if (req.body.userType && req.body.userType !== "tutor" && req.body.userType !== "customer") {
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

const cancelTutorial = async (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, '_id')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a _id property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'status')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a status property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'tutorFirstName')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a tutorFirstName property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'customerFirstName')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a customerFirstName property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'tutorEmail')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a tutorEmail property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'customerEmail')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a customerEmail property'
    });

    if (req.body.status === 'cancelled') {
        tutorialModel.updateOne({ _id: req.body._id }, { tutorialStatus: req.body.status, transactionStatus: 'inProgress' }).then(tutorial => {
            emailService.emailNotification(req.body.tutorEmail, req.body.tutorFirstName, 'Tutorial Session Canceled', emailService.cancelTutorial);
            emailService.emailNotification(req.body.customerEmail, req.body.customerFirstName, 'Tutorial Session Canceled', emailService.cancelTutorial);
            return res.status(200).json({
                tutorial: tutorial,
            });
        }).catch(error => {
            console.log('error by creating a tutorial');
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
    }
};

const closeTutorial = async (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, '_id')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a _id property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'status')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a status property'
    });

    if (req.body.status === 'closed') {
        var ObjectID = require('mongodb').ObjectID;
        tutorialModel.updateOne({ _id: ObjectID(req.body._id) }, { tutorialStatus: req.body.status }).then(tutorial => {
            return res.status(200).json({
                tutorial: tutorial,
            })
        }).catch(error => {
            console.log('error by closing a Tutorial');
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
    }
};

const getAllTutorials = async (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'ids')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a ids property'
    });
    let ids = req.body.ids;
    if (ids) {
        tutorialModel.find().where('_id').in(ids).exec().then(records => {
            return res.status(200).json(records);
        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
    } else {
        return res.status(200).json({});
    }
};

const getAllTutorialsByTutorId = async (req, res) => {
    const {
        tutorId,
    } = req.params;

    if(tutorId){
        tutorModel.findById(tutorId).exec().then(tutor => {
            tutorialModel.find().where('_id').in(tutor.bookedTutorialSessionIds).exec().then(records => {
                return res.status(200).json(records);
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
    } else {
        return res.status(200).json({});
    }
};


const getTutorialById = async (req, res) => {
    const {
        tutorialId,
    } = req.params;
    if(tutorialId){
        tutorialModel.findById(tutorialId).exec().then(tutorial => {  
                return res.status(200).json(tutorial);
        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
    } else {
        return res.status(200).json({});
    }
};

const getAllReviewsByTutorId = async (req, res) => {
    const {
        tutorId,
    } = req.params;

    if(tutorId){
        tutorModel.findById(tutorId).exec().then(tutor => {
            reviewModel.find().where('_id').in(tutor.reviewIds).exec().then(records => {
                return res.status(200).json(records);
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
    } else {
        return res.status(200).json({});
    }
};

module.exports = {
    login,
    register,
    cancelTutorial,
    closeTutorial,
    getAllTutorials,
    getAllTutorialsByTutorId,
    getAllReviewsByTutorId,
    getTutorialById
};
