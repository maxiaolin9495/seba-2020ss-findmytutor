"use strict";

import HttpService from './HttpService';
const config = require('../config');

export default class TutorPageService {

    constructor() {
    }

    static baseURL = () => config.backendUri + '/tutor';

    static getTutorProfileById(_id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/tutorProfileById?` + new URLSearchParams({_id}).toString(),
                function (data) {
                    if (data !== undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving tutor profile');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getTutorReviews(_id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${config.backendUri}/user/getAllReviews/${_id}`,
                function (data) {
                    if (data !== undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving tutor profile');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static contactTutor(contactInfos) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${config.backendUri}/customer/contactTutor`, contactInfos,
                function (data) {
                    resolve(data)
                }, function (textStatus) {
                    reject(textStatus)
                });
        });
    };
}