const tutorialModel = require('../models/tutorial');
const customerModel = require('../models/customer');

const getTutorialsForCustomer = (req, res) =>{
    const email = req.query.email;
    tutorialModel.find({customerEmail: email})
        .then(tutorials =>{
            return res.status(200).json(tutorials);
        })
        .catch(error => {
            console.log('internal error by searching');
            return req.status(400).json({error: error.message})
        })
};

const getCustomerProfile = (req, res) => {
    if (req.userType === 'customer') {
        customerModel.findOne({ email: req.email }).exec()
            .then(customer => {
                return res.status(200).json({
                    email: customer.email,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    university: customer.university,
                })
            })
    } else
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Wrong user type'
        });
};

const uploadCustomerProfile = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });
    if (req.body.email !== req.email)
        return res.status(400).json({
            error: 'Bad Request',
            message: 'No permission to upload other profile'
        });
    if (req.userType === 'customer') {
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
            university: req.body.university,
        });
        customerModel.updateOne({ email: customer.email }, customer).then(customer => {
            return res.status(200).json({ message: "successfully updated" });
        }).catch(error => {
            console.log('error by creating a customer Profile');
            if (error.code === 11000) {
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
};

module.exports = {
    getTutorialsForCustomer,
    getCustomerProfile,
    uploadCustomerProfile,
};