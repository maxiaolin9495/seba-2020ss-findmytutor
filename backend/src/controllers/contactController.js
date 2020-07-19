const customerSupportModel = require('../models/customerSupportModel');
const emailService = require('../services/emailService');
const requestBodyVerificationService =  require('../services/requestBodyVerificationService');


const saveMessage = (req, res) => {

    let verificationResult = requestBodyVerificationService.verifyRequestBody(
        [
            "message",
            "email",
            "firstName"
        ], req);

    if (!verificationResult.ifValid) {

        return res.status(400).json(verificationResult.message);

    }

    let timestamp = (new Date()).valueOf();
    const contact = {
        "email": req.body.email,
        "message": req.body.message,
        "supportStatus": "open",
        "timeStamp": timestamp,
    };

    customerSupportModel.create(contact)
        .then(() => {
            emailService.contactUs(req.body.email, req.body.firstName);
            return res.status(200).json({});
        }).catch(error => {
        console.log('error happened by creating customerSupport');
        return res.status(400).json({error: error})
    })


};

module.exports = {
    saveMessage
};