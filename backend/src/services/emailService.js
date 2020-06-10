import * as emailjs from "emailjs-com";

const serviceId = "gmail";
const feedbackTemplateId = "feedbackFindMyTutor";
const notificationTemplateId = 'Notification';
const userId = 'user_dSKdVGR3vH7TctvEXGiI7';
const newTutorial = 'You have new Tutorial Session from FindMyTutor, please confirm it or cancel it in soon.';
const confirmTutorial = 'Your Tutorial Session  has just been confirmed by tutor ';
const cancelTutorial = 'Your Tutorial Session  has just been canceled';
const reviewTutorial = 'Your Tutorial Session  has been just reviewed';

//email endpoint for contact us
const contactUs = (email, firstName) => {
    return new Promise((resolve, reject) => {
        emailjs.send(serviceId, feedbackTemplateId, {
            "to_email": email,
            "to_name": firstName
        }, userId).then (function (response) {
            resolve(response)
        }, function (err) {
            console.log(err);
            reject(err)
        });
    })
};

const emailNotification = (email, firstName, subject, message) =>{
    return new Promise((resolve, reject) => {
        emailjs.send(serviceId, notificationTemplateId, {
            "to_email": email,
            "to_name": firstName,
            "subject": subject,
            "message": message
        }, this.userId).then(function (response) {
            resolve(response)
        }, function (err) {
            console.log(err);
            reject(err)
        });
    })
};

module.exports = {
    newTutorial,
    confirmTutorial,
    cancelTutorial,
    reviewTutorial,
    contactUs,
    emailNotification
};