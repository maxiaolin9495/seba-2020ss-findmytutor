const jwt = require('jsonwebtoken');
const customerModel = require('../models/customer');
const tutorModel = require('../models/tutor');
const config = require('../config');
const tutorialModel = require('../models/tutorial');
const emailService = require('../services/emailService');

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

        const user = Object.assign(req.body, { ifProved: false });
        return registerUser(user, customerModel, tutorModel, req, res);

    } else {

        const user = Object.assign(req.body);
        return registerUser(user, tutorModel, customerModel, req, res);

    }

};

const registerUser = (user, dataModel1, dataModel2, req, res) => {
    dataModel1.findOne({ email: req.body.email }).exec()
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
    dataModel.findOne({ email: req.body.email }).exec()//customerModel schema
        .then(user => {//user object
            console.log(user);
            // check if the password is valid
            if (!(req.body.password === user.password)) return res.status(401).send({ token: null });

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

const createTutorial = (req, res) => {

    //todo this create logic is far from perfect, further work needed
    if (!Object.prototype.hasOwnProperty.call(req.body, 'tutorFirstName')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a tutorFirstName property'
    });

    if (req.userType === 'customer') {
        const tutorial = Object.assign({
            tutorEmail: req.body.tutorEmail,
            customerEmail: req.body.customerEmail,
            sessionTopic: req.body.sessionTopic,
            bookedTime: req.body.bookedTime,
            price: req.body.price,
            tutorialStatus: 'notConfirmed',
            transactionStatus: 'transferred'
        });
        tutorialModel.create(tutorial).then(tutorial => {
            console.log(tutorial);
            let tutorialId = tutorial._id;
            let error = updateTutorialForTutor(req.body.tutorEmail, tutorialId);
            if (!error) {
                error = updateTutorialForCustomer(req.body.customerEmail, tutorialId);
                if (!error) {
                    emailService.emailNotification(req.body.tutorEmail, req.body.tutorFirstName, 'New Tutorial Session', emailService.newTutorial);
                    return res.status(200).json({
                        tutorEmail: req.body.tutorEmail,
                        customerEmail: req.body.customerEmail,
                        sessionTopic: req.body.sessionTopic,
                        bookedTime: req.body.bookedTime,
                        price: req.body.price,
                        tutorialStatus: 'notConfirmed',
                        transactionStatus: 'transferred'
                    });
                }
            }
        }).catch(error => {
            console.log('error by creating a Tutorial');
            if (error.code === 11000) {
                return res.status(400).json({
                    error: 'Internal server error happens by add Tutorial',
                    message: error.message
                })
            }
            else {
                return res.status(500).json({
                    error: 'Internal server error happens by add Tutorial',
                    message: error.message
                })
            }
        });
       
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

    if (req.body.status === 'canceled') {
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
        tutorialModel.updateOne({ _id: req.body._id }, { tutorialStatus: req.body.status }).then(tutorial => {
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
            console.log(records);
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

const getAlltutorialsById = (req, res) => {

};

const updateTutorialForTutor = (email, bookedTutorialSessionId) => {
    tutorModel.updateOne({ email: email }, { $push: { bookedTutorialSessionIds: bookedTutorialSessionId } }).exec().then(tutor => {
        console.log(tutor);
        return tutor;
    }).catch(error => {
        console.log('error by adding a course to the tutor');
        return error;
    });

};

const updateTutorialForCustomer = (email, bookedTutorialSessionId) => {
    customerModel.updateOne({ email: email }, { $push: { bookedTutorialSessionIds: bookedTutorialSessionId } }).exec().then(customer => {
    }).catch(error => {
        console.log('error by adding a course to the customer');
        return error;
    });

};

module.exports = {
    login,
    register,
    createTutorial,
    cancelTutorial,
    closeTutorial,
    getAllTutorials
};
