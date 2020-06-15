"use strict";

import HttpService from './HttpService';
const config = require('../config');

export default class TutorialService {
    static baseURL = () => config.backendUri;

    static createBooking(booking) {
        console.log(booking);
        return new Promise((resolve, reject) => {

            HttpService.put(this.baseURL() + '/createTutorial',
                {
                    tutorEmail: booking.tutorEmail,
                    customerEmail: booking.customerEmail,
                    sessionTopic: booking.sessionTopic,
                    bookedTime: booking.bookedTime,
                    price: booking.price,
                    tutorialStatus: booking.tutorialStatus,
                    transactionStatus: booking.transactionStatus,
                    startTime:booking.startTime,
                    endTime:booking.endTime
                }, function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });

        })
    }

    static getAllTutorials(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/getAllTutorials/${id}`, function (data) {
                console.log(data)
                if (data !== undefined || Object.keys(data).length !== 0) {
                    resolve(data);
                }
                else {
                    reject('Error while retrieving tutorials');
                }
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }
}