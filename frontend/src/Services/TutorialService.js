"use strict";

import HttpService from './HttpService';
const config = require('../config');

export default class TutorialService {
    static baseURL = () => config.backendUri;

    static createBooking(booking) {
        console.log(booking);
        return new Promise((resolve, reject) => {

            HttpService.post(this.baseURL() + '/customer/createTutorial',
                {
                    tutorFirstName: booking.tutorFirstName,
                    tutorEmail: booking.tutorEmail,
                    customerEmail: booking.customerEmail,
                    sessionTopic: booking.sessionTopic,
                    selectedCourse: booking.selectedCourse,
                    bookedTime: booking.bookedTime,
                    price: booking.price,
                    tutorialStatus: booking.tutorialStatus,
                    transactionStatus: booking.transactionStatus,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    transactionId: booking.transactionId
                }, function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });

        })
    }

    static getAllTutorials(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/user/getAllTutorials/${id}`,
                function (data) {
                    console.log('service');
                    console.log(data);

                    if (data !== undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving tutorials');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getTutorByTutorEmail(email) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/tutor/searchTutorByEmail?` + new URLSearchParams({q: email}).toString(),
                function (data) {
                    if (data !== undefined) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving tutors');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getAllTutorialsForCustomer() {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${this.baseURL()}/user/tutorialForCustomer`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getTutorial(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/user/getTutorial/${id}`,
                function (data) {
                    if (data !== undefined) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving tutorial');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getAllTutorialsForTutor() {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${this.baseURL()}/user/tutorialForTutor`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static confirmTutorial(tutorialInfo) {
        return new Promise((resolve, reject) => {
            HttpService.put(
                `${this.baseURL()}/tutor/confirmTutorial`,
                tutorialInfo,
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                });
        })
    }

    static cancelTutorial(tutorialInfo) {
        return new Promise((resolve, reject) => {
            HttpService.put(
                `${this.baseURL()}/user/cancelTutorial`,
                tutorialInfo,
                function (data) {
                    resolve(data);
                },
                function (textStatus) {
                    reject(textStatus);
                });
        })
    }
}