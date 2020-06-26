const tutorialModel = require('../models/tutorial');
const tutorModel = require('../models/tutor');
const emailService = require('../services/emailService');
const tutor = require('../models/tutor');

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
                    avatar: tutor.avatar,
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
    if (!Object.prototype.hasOwnProperty.call(req.query, '_id')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a _id property'
    });
    tutorModel.findOne({ _id: req.query._id }).exec()
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
                avatar: tutor.avatar
            })
        }).catch(error => {
            return res.status(404).json({
                error: 'Tutor not found',
                message: error.message
            })
        })
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
        //todo timeSlots are not required during update tutor's profile, it should be added separately
        // if (!Object.prototype.hasOwnProperty.call(req.body, 'timeSlotIds')) return res.status(400).json({
        //     error: 'Bad Request',
        //     message: 'The request body must contain a time slot property'
        // });
        //todo it's similar for the avatar part
        // if (!Object.prototype.hasOwnProperty.call(req.body, 'avatar')) return res.status(400).json({
        //     error: 'Bad Request',
        //     message: 'The request body must contain an avatar property'
        // });
        const tutor = Object.assign({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            university: req.body.university,
            price: req.body.price,
            description: req.body.description,
            courses: req.body.courses,
            timeSlotIds: req.body.timeSlotIds,
            avatar: req.body.avatar,
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

    if (!Object.prototype.hasOwnProperty.call(req.body, 'customerFirstName')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a tutorFirstName property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'customerEmail')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a customerEmail property'
    });

    if (req.body.status === 'confirmed') {
        tutorialModel.updateOne({ _id: req.body._id }, { tutorialStatus: req.body.status }).then(tutorial => {
            emailService.emailNotification(req.body.customerEmail, req.body.customerFirstName, 'Tutorial Session Confirmed', emailService.confirmTutorial);
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

const getTutorialsForTutor = (req, res) => {
    const email = req.email;
    tutorialModel.find({ tutorEmail: email })
        .then(tutorials => {
            return res.status(200).json(tutorials)
        })
        .catch(error => {
            console.log('internal server error by searching');
            return res.status(400).json({ error: error.message })
        })
};

const getReviews = (req, res) => {

};

const searchTutor = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.query, 'q'))
        return res.status(200).json({
            error: 'Bad Request',
            message: 'The request query must contain a q property'
        });
    if (!req.query.q)
        return res.status(200).json({});
    if (decodeURI(req.query.q).includes(',')) {
        // Find tutor
        const [lastName, firstName] = decodeURI(req.query.q).split(/[ ,]+/);
        tutorModel.find(
            { $and: [{ 'firstName': firstName }, { 'lastName': lastName }] }
        ).then(tutors => {
            return res.status(200).json(tutors);
        }).catch(error => {
            console.log('internal server error by searching');
            return res.status(400).json({
                error: 'Internal Server Error',
                message: 'Error in search function: ' + error.message
            });
        })
    } else {
        const queryString = req.query.q;
        const pattern = new RegExp(`${queryString}`, 'i'); // Regex find all value match the query string starting from the first position
        const l = queryString.length;
        // const filteredData = await 
        tutorModel.find(
            { $or: [{ 'firstName': pattern }, { 'lastName': pattern }, { 'courses': pattern }] }
        ).then(tutors => {
            return res.status(200).json(tutors);
        }).catch(error => {
            console.log('internal server error by searching');
            return res.status(400).json({
                error: 'Internal Server Error',
                message: 'Error in search function: ' + error.message
            });
        })
    }
};

const autoCompleteForSearch = async (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.query, 'q'))
        return res.status(200).json({
            error: 'Bad Request',
            message: 'The request query must contain a q property'
        });
    // if (!req.query.q)
    //     return res.status(200).json({});
    const queryString = req.query.q;
    const pattern = new RegExp(`${queryString}`, 'i');
    const length = queryString.length;
    let filteredCourses = [];
    // TODO: Combine two queries to one
    try {
        const courses = await tutorModel.distinct('courses');
        const tutorNames = await tutorModel.find(
            { $or: [{ 'firstName': pattern }, { 'lastName': pattern }] },
            { firstName: true, lastName: true, _id: false }
        );
        filteredCourses = courses.reduce((matches, c) => {
            if (pattern.test(c)) {
                // let pos = 1;
                // matches.push({
                //     label: [
                //         <span key="bold" className="md-font-bold">{c.substring(0, l)}</span>,
                //         c.substring(length),
                //     ],
                //     value: c,
                // });
                matches.push(c);
            }
            return matches;
        }, []);
        filteredTutorName = filteredTutorName = tutorNames.reduce((matches, tN) => {
            const { firstName, lastName } = tN;
            matches.push(lastName + ', ' + firstName);
            return matches;
        }, []);
        return res.status(200).json([...filteredCourses, ...filteredTutorName]);
    } catch (error) {
        console.log('internal server error by auto complete function for searching');
        return res.status(400).json({
            error: 'Internal Server Error',
            message: 'Error in auto complete function: ' + error.message
        });
    }
};

const searchTutorByEmail=(req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.query, 'q'))
        return res.status(200).json({
            error: 'Bad Request',
            message: 'The request query must contain a q property'
        });
    if (!req.query.q)
        return res.status(200).json({});
    const tutorEmail = decodeURI(req.query.q);
    tutorModel.findOne({ email: tutorEmail }).exec()
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
                avatar: tutor.avatar
            })
        }).catch(error => {
            return res.status(404).json({
                error: 'Tutor not found',
                message: error.message
            })
        })
};


module.exports = {
    getTutorProfile,
    getTutorProfileById,
    uploadTutorProfile,
    getTutorialsForTutor,
    confirmTutorial,
    searchTutor,
    autoCompleteForSearch,
    searchTutorByEmail,
};