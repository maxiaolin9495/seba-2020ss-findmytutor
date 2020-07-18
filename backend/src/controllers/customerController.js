const customerModel = require('../models/customerModel');
const tutorialModel = require('../models/tutorialModel');
const tutorModel = require('../models/tutorModel');
const reviewModel = require('../models/reviewModel');
const emailService = require('../services/emailService');
const requestBodyVerificationService =  require('../services/requestBodyVerificationService');

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

const searchCustomerByEmail = (req, res) => {

    if (!Object.prototype.hasOwnProperty.call(req.query, 'q'))
        return res.status(200).json({
            error: 'Bad Request',
            message: 'The request query must contain a q property'
        });

    if (!req.query.q) {
        return res.status(200).json({});
    }

    const customerEmail = decodeURI(req.query.q);
    customerModel.findOne({ email: customerEmail })
        .exec()
        .then(customer => {
            return res.status(200).json({
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                university: customer.university,
            })
        }).catch(error => {
            return res.status(404).json({
                error: 'Customer not found',
                message: error.message
            })
        })
};

const uploadCustomerProfile = (req, res) => {

    let verificationResult = requestBodyVerificationService.verifyRequestBody(
        [
            "firstName",
            "lastName",
            "university",
            "email"
        ], req);

    if (!verificationResult.ifValid) {

        return res.status(400).json(verificationResult.message);

    }

    if (req.body.email !== req.email) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'No permission to upload other profile'
        });
    }

    if (req.userType === 'customer') {

        const customer = Object.assign({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            university: req.body.university,
        });
        customerModel.updateOne({email: customer.email}, customer)
            .then(() => {
                return res.status(200).json({message: "successfully updated"});
            }).catch(error => {
            console.log('error by creating a customer Profile');
            if (error.code === 11000) {
                return res.status(400).json({
                    error: 'customer Profile exists',
                    message: error.message
                })
            } else {
                return res.status(500).json({
                    error: 'Internal server error happens by add customer Profile',
                    message: error.message
                })
            }
        });
    }
};


const createReview = (req, res) => {

    let verificationResult = verifyReviewBody(req, res);

    if (!verificationResult.ifValid) {
        return res.status(400).json(verificationResult.message);
    }


    let overallRating = Math.round((req.body.comprehensionRating + req.body.friendlinessRating + req.body.teachingStyleRating) / 3);

    let review = Object.assign({
        comprehensionRating: req.body.comprehensionRating,
        friendlinessRating: req.body.friendlinessRating,
        teachingStyleRating: req.body.teachingStyleRating,
        text: req.body.text,
        overallRating: overallRating,
        tutorEmail: req.body.tutorEmail,
        customerEmail: req.body.customerEmail
    });

    reviewModel.create(review).then(
        review => {
            let error = updateReviewForCustomer(req.email, review._id);
            if (!error) {
                error = updateReviewForTutor(req.body.tutorEmail, review._id);
                if (!error) {
                    error = updateRatingForTutor(req.body.tutorEmail);
                    emailService.emailNotification(req.body.tutorEmail, req.body.tutorFirstName, "New Feedback Received", emailService.reviewTutorial);
                    if (!error) {
                        return res.status(200).json(review);
                    }
                }
            }
            console.log(error);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Internal server error happened when create a new review ' + error.message
            });
        }
    ).catch(error => {
        console.log(error);
        return res.status(404).json({
            error: 'Review Not Created',
            message: error.message
        });
    })


};

const updateReview = (req, res) => {

    const {
        reviewId,
    } = req.params;

    if (!reviewId) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a reviewId parameter'
    });

    let verificationResult = verifyReviewBody(req, res);

    if (!verificationResult.ifValid) {
        return res.status(400).json(verificationResult.message);
    }

    let overallRating = Math.round((req.body.comprehensionRating + req.body.friendlinessRating + req.body.teachingStyleRating) / 3);

    let review = Object.assign({
        comprehensionRating: req.body.comprehensionRating,
        friendlinessRating: req.body.friendlinessRating,
        teachingStyleRating: req.body.teachingStyleRating,
        text: req.body.text,
        overallRating: overallRating,
        tutorEmail: req.body.tutorEmail,
        customerEmail: req.body.customerEmail
    });

    reviewModel.updateOne({_id: reviewId}, review)
        .then(
            review => {
                let error = updateRatingForTutor(req.body.tutorEmail);
                if (!error) {
                    return res.status(200).json(review);
                }
                console.log(error);
                return res.status(500).json({
                    error: 'Internal server error',
                    message: 'Internal server error happened when create a new review ' + error.message
                });
            }
        ).catch(error => {
        console.log(error);
        return res.status(404).json({
            error: 'Review Not Found',
            message: error.message
        });
    })

};

const getReview = (req, res) => {
    const {
        reviewId,
    } = req.params;

    if (!reviewId) return res.status(400).json({
        error: 'Bad Request',
        message: 'The path must contain a reviewId parameter'
    });

    reviewModel.findById(reviewId).then(
        review => {
            return res.status(200).json(review);
        }
    ).catch(error => {
        console.log(error);
        return res.status(404).json({
            error: 'Review Not Found',
            message: error.message
        });
    })

};

const verifyReviewBody = (req, res) => {

    let verificationResult = requestBodyVerificationService.verifyRequestBody(
        [
            "tutorEmail",
            "comprehensionRating",
            "friendlinessRating",
            "teachingStyleRating",
            "text"
        ], req);

    if (!verificationResult.ifValid) {

        return res.status(400).json(verificationResult.message);

    }

    return {
        ifValid: true
    }
};

const updateReviewForTutor = (email, reviewId) => {
    tutorModel.updateOne({ email: email }, { $push: { reviewIds: reviewId } })
        .exec()
        .catch(error => {
        console.log('error by adding a review id to the tutor');
        return error;
    });

};

const updateRatingForTutor = (email) => {
    tutorModel.findOne({email: email})
        .exec()
        .then(
            tutor => {
                let reviewIds = tutor.reviewIds;
                let sumOverallRating = 0;
                reviewModel.find()
                    .where('_id')
                    .in(reviewIds)
                    .exec()
                    .then(reviews => {
                        for (let i = 0; i < reviews.length; i++) {
                            sumOverallRating += reviews[i].overallRating;
                        }
                        tutorModel.updateOne(
                            {email: email}, {rating: Math.round(sumOverallRating / reviews.length)}
                        ).exec();
                    });
            }
        ).catch(error => {
        console.log('error by update rating to the tutor');
        return error;
    });

};

const createTutorial = (req, res) => {


    if (req.userType === 'customer') {

        let verificationResult = requestBodyVerificationService.verifyRequestBody(
            [
                "tutorFirstName",
                "tutorEmail",
                "customerEmail",
                "sessionTopic",
                "selectedCourse",
                "price",
                "startTime",
                "endTime",
                "transactionId"
            ], req);

        if (!verificationResult.ifValid) {

            return res.status(400).json(verificationResult.message);

        }

        const tutorial = Object.assign({
            tutorEmail: req.body.tutorEmail,
            customerEmail: req.body.customerEmail,
            sessionTopic: req.body.sessionTopic,
            selectedCourse: req.body.selectedCourse,
            bookedTime: req.body.bookedTime,
            price: req.body.price,
            tutorialStatus: 'notConfirmed',
            transactionStatus: 'transferred',
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            transactionId: req.body.transactionId,
            ifHadVideo: false
        });

        tutorModel.findOne({email: tutorial.tutorEmail}).exec()
            .then(
                tutor => {
                    let newTimeSlots = updateTimeSlots(tutor.timeSlotIds, tutorial);
                    if (newTimeSlots.invalidTimeSpan) {
                        return res.status(400).json({
                            error: 'Bad Request',
                            message: 'The request body contains an invalid time span'
                        });
                    } else {
                        tutorialModel.create(tutorial)
                            .then(tutorial => {
                                let tutorialId = tutorial._id;
                                let transactionId = tutorial.transactionId;
                                let error = updateTutorialAndTransactionForTutor(req.body.tutorEmail, tutorialId, transactionId);
                                if (!error) {
                                    error = updateTutorialAndTransactionForCustomer(req.body.customerEmail, tutorialId, transactionId);
                                    if (!error) {
                                        emailService.emailNotification(req.body.tutorEmail, req.body.tutorFirstName, 'New Tutorial Session', emailService.newTutorial);
                                        tutorModel.updateOne(
                                            {email: tutor.email},
                                            {timeSlotIds: newTimeSlots.timeSlotIds}
                                        ).then(
                                            tutor => {
                                                console.log(tutor)
                                            }
                                        );
                                        return res.status(200).json({
                                            tutorEmail: req.body.tutorEmail,
                                            customerEmail: req.body.customerEmail,
                                            sessionTopic: req.body.sessionTopic,
                                            selectedCourse: req.body.selectedCourse,
                                            bookedTime: req.body.bookedTime,
                                            price: req.body.price,
                                            tutorialStatus: 'notConfirmed',
                                            transactionStatus: 'transferred',
                                            startTime: req.body.startTime,
                                            endTime: req.body.endTime
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
                            } else {
                                return res.status(500).json({
                                    error: 'Internal server error happens by add Tutorial',
                                    message: error.message
                                })
                            }
                        });

                    }
                }
            )
            .catch(
                error => {
                    console.log('error by adding a tutorial id to the tutor');
                    return error;
                }
            );
    } else {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'The request body must contain a tutorFirstName property'
        });
    }
};

const updateTimeSlots = (timeSlotIds, tutorial) => {
    let newTimeSlots = [];
    for (let i = 0; i < timeSlotIds.length; i++) {
        if (timeSlotIds[i].end <= tutorial.startTime ||
            timeSlotIds[i].start >= tutorial.endTime) {
            newTimeSlots.push(timeSlotIds[i]);
        } else {
            if (timeSlotIds[i].end < tutorial.endTime ||
                timeSlotIds[i].start > tutorial.startTime) {
                return {
                    invalidTimeSpan: true
                };
            } else {
                //time before booking
                if (timeSlotIds[i].start < tutorial.startTime) {
                    newTimeSlots.push(
                        {
                            start: timeSlotIds[i].start,
                            end: tutorial.startTime,
                            ifBooked: false
                        }
                    );
                }

                //the tutorial time span
                newTimeSlots.push(
                    {
                        start: tutorial.startTime,
                        end: tutorial.endTime,
                        ifBooked: true
                    }
                );

                if (timeSlotIds[i].end > tutorial.endTime) {
                    newTimeSlots.push(
                        {
                            start: tutorial.endTime,
                            end: timeSlotIds[i].end,
                            ifBooked: false
                        }
                    )
                }


            }
        }
    }

    return {
        invalidTimeSpan: false,
        timeSlotIds: newTimeSlots
    };

};

const updateTutorialAndTransactionForTutor = (email, bookedTutorialSessionId, transactionId) => {
    tutorModel.updateOne(
        { email: email },
        {
            $push: {
                bookedTutorialSessionIds: bookedTutorialSessionId,
                transactionIds: transactionId
            }
        })
        .exec()
        .catch(
            error => {
                console.log('error by adding a tutorial id to the tutor');
                return error;
            });
};

const updateTutorialAndTransactionForCustomer = (email, bookedTutorialSessionId, transactionIds) => {
    customerModel.updateOne(
        { email: email },
        {
            $push: {
                bookedTutorialSessionIds: bookedTutorialSessionId,
                transactionIds: transactionIds
            }
        })
        .exec()
        .catch(
            error => {
                console.log('error by adding a tutorial id to the customer');
                return error;
            });
};

const updateReviewForCustomer = (email, reviewId) => {
    customerModel.updateOne(
        {email: email},
        {
            $push: {reviewIds: reviewId}
        })
        .exec()
        .catch(
            error => {
                console.log('error by adding a review id to the customer');
                return error;
            });
};

const contactTutor = (req, res) => {

    let verificationResult = requestBodyVerificationService.verifyRequestBody(
        [
            "customerFirstName",
            "customerLastName",
            "content",
            "tutorEmail",
            "tutorFirstName"
        ], req);

    if (!verificationResult.ifValid) {

        return res.status(400).json(verificationResult.message);

    }


    let message = `Our customer ${req.body.customerFirstName} ${req.body.customerLastName} would like to know more about you
        He/She leaves a message to you: \n ${req.body.content} \n`;

    emailService.emailNotification(req.body.tutorEmail, req.body.tutorFirstName, "Message from customer", message);
    return res.status(200).json({});
}

module.exports = {
    getCustomerProfile,
    createTutorial,
    uploadCustomerProfile,
    createReview,
    updateReview,
    getReview,
    searchCustomerByEmail,
    contactTutor
};