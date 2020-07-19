const nodeMailer = require('nodemailer');
const config = require('../config.js');
const newTutorial = 'You have new Tutorial Session from FindMyTutor, please confirm it or cancel it in soon.';
const confirmTutorial = 'Your Tutorial Session has just been confirmed by tutor ';
const cancelTutorial = 'Your Tutorial Session has just been canceled';
const reviewTutorial = 'Your Tutorial Session has just been reviewed';

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmailAccount,
        pass: config.gmailPassword
    }
});

//email endpoint for contact us
const contactUs = (email, firstName) => {

    let mailOptions = {
        from: 'findmytutor2020@gmail.com',
        to: email,
        subject: 'New message from FindMyTutor',
        text: 'Hello ' + firstName + ',\n' +
            '\n' +
            'we have received your request. Our customer service team will contact you as soon as possible. \n' +
            '\n' +
            ' \n' +
            'Best Regards\n' +
            'Your FindMyTutor Team'
    };

    transporter.sendMail(mailOptions,
        function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

};

const emailNotification = (email, firstName, subject, message) => {

    let mailOptions = {
        from: 'findmytutor2020@gmail.com',
        to: email,
        subject: subject,
        text: 'Hello ' + firstName + ',\n' +
            '\n' +
            message +
            '\n' +
            '\n' +
            'Best Regards\n' +
            'Your FindMyTutor Team'
    };

    transporter.sendMail(mailOptions,
        function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
};

module.exports = {
    newTutorial,
    confirmTutorial,
    cancelTutorial,
    reviewTutorial,
    contactUs,
    emailNotification
};