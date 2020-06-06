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
            if (data === null) {
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
const getTutorProfile = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'userType')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a userType property'
    });

    if (req.body.userType === 'tutor') {
        tutorModel.findOne({email: req.body.email}).exec()
        .then(tutor => {
            return res.status(200).json({
                email: tutor.email,
                firstName: tutor.firstName,
                lastName: tutor.lastName,
                university: tutor.university,
                description: tutor.description,
                price: tutor.price,
                photo: tutor.photo,
            })
        })
    }
}
const uploadTutorProfile = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });
    if (req.body.userType === 'tutor') {
        if (!Object.prototype.hasOwnProperty.call(req.body, 'firstName')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a firstName property'
        });
    
        if (!Object.prototype.hasOwnProperty.call(req.body, 'lastName')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a lastName property'
        });
    
        if (!Object.prototype.hasOwnProperty.call(req.body, 'university')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a university property'
        });
    
        if (!Object.prototype.hasOwnProperty.call(req.body, 'price')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a price property'
        });
    
        if (!Object.prototype.hasOwnProperty.call(req.body, 'description')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a description property'
        });
        const tutor = Object.assign({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            university: req.body.university,
            price: req.body.price,
            description: req.body.description,
        });
        tutorModel.updateOne({email: tutor.email}, tutor).then(tutor => {
            return res.status(200).json({message: "successfully updated"});
        }).catch(error => {
            console.log('error by creating a Tutor Profile');
            if (error.code == 11000) {
                return res.status(400).json({
                    error: 'tutor Profile exists',
                    message: error.message
                })
            }
            else {
                return res.status(500).json({
                    error: 'Internal server error happens by add tutor Profile',
                    message: error.message
                })
            }
        });
    }

}
const getCustomerProfile = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'userType')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a userType property'
    });

    if (req.body.userType === 'customer') {
        customerModel.findOne({email: req.body.email}).exec()
        .then(customer => {
            return res.status(200).json({
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                university: customer.university,
            })
        })
    }
}

const uploadCustomerProfile = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });
    if (req.body.userType === 'customer') {
        if (!Object.prototype.hasOwnProperty.call(req.body, 'firstName')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a firstName property'
        });
    
        if (!Object.prototype.hasOwnProperty.call(req.body, 'lastName')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a lastName property'
        });
    
        if (!Object.prototype.hasOwnProperty.call(req.body, 'university')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a university property'
        });
    
        const customer = Object.assign({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            university: customer.university,
        });
        customerModel.updateOne({email: customer.email}, customer).then(customer => {
            return res.status(200).json({message: "successfully updated"});
        }).catch(error => {
            console.log('error by creating a customer Profile');
            if (error.code == 11000) {
                return res.status(400).json({
                    error: 'customer Profile exists',
                    message: error.message
                })
            }
            else {
                return res.status(500).json({
                    error: 'Internal server error happens by add customer Profile',
                    message: error.message
                })
            }
        });
    }

}
module.exports = {
    login,
    register,
    getTutorProfile,
    uploadTutorProfile,
    getCustomerProfile,
    uploadCustomerProfile,
};
