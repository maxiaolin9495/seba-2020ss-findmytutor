const tutorialModel = require('../models/tutorial');
const tutorModel = require('../models/tutor');

const getTutorProfile = (req, res) => {
    if (req.userType === 'tutor') {
        tutorModel.findOne({ email: req.email }).exec()
            .then(tutor => {
                return res.status(200).json({
                    email: tutor.email,
                    firstName: tutor.firstName,
                    lastName: tutor.lastName,
                    university: tutor.university,
                    price: tutor.price,
                    description: tutor.description,
                    courses: tutor.courses,
                    timeSlotIds: tutor.timeSlotIds,
                })
            })
    }
    else
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid userType value'
        });
};

const getTutorProfileById = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, '_id')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a _id property'
    });
    if (req.userType === 'tutor') {
        tutorModel.findOne({ _id: req.body._id }).exec()
            .then(tutor => {
                return res.status(200).json({
                    email: tutor.email,
                    firstName: tutor.firstName,
                    lastName: tutor.lastName,
                    university: tutor.university,
                    price: tutor.price,
                    description: tutor.description,
                    courses: tutor.courses,
                    timeSlotIds: tutor.timeSlotIds,
                })
            })
    }
    else
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid userType value'
        });
};

const uploadTutorProfile = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a email property'
    });
    if (req.body.email !== req.email)
        return res.status(400).json({
            error: 'Bad Request',
            message: 'No permission to upload other profile'
        });
    if (req.userType === 'tutor') {
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
        if (!Object.prototype.hasOwnProperty.call(req.body, 'timeSlotIds')) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a time slot property'
        });
        const tutor = Object.assign({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            university: req.body.university,
            price: req.body.price,
            description: req.body.description,
            courses: req.body.courses,
            timeSlotIds: req.body.timeSlotIds,
        });
        tutorModel.updateOne({ email: tutor.email }, tutor).then(tutor => {
            return res.status(200).json({ message: "successfully updated" });
        }).catch(error => {
            console.log('error by creating a Tutor Profile');
            if (error.code === 11000) {
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
};

const confirmTutorial = async (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, '_id')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a _id property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'status')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a status property'
    });

    if (req.body.status === 'confirmed') {
        tutorialModel.updateOne({ _id: req.body._id }, { tutorialStatus: req.body.status }).then(tutorial => {
            return res.status(200).json({
                tutorial: tutorial,
            })
        }).catch(error => {
            console.log('error by creating a tutorial');
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
    }
};

const getTutorialsForTutor = (req, res) => {
    const email = req.query.email;
    tutorialModel.find({tutorEmail: email})
        .then(tutorials => {
            return res.status(200).json(tutorials)
        })
        .catch(error => {
            console.log('internal server error by searching');
            return req.status(400).json({error: error.message})
        })
};

module.exports = {
    getTutorProfile,
    getTutorProfileById,
    uploadTutorProfile,
    getTutorialsForTutor,
    confirmTutorial,

};