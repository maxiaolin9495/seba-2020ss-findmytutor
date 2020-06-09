const tutorialModel = require('../models/tutorial');
const customerModel = require('../models/customer');

const getTutorialsForCustomer = (req, res) =>{
    const email = req.query.email;
    tutorialModel.find({customerEmail: email})
        .then(tutorials =>{
            return res.status(200).json(tutorials);
        })
        .catch(error => {
            console.log('internal server error by searching');
            return req.status(400).json({error: error.message})
        })
};
module.exports = {
    getTutorialsForCustomer,
};