"use strict";

import HttpService from './HttpService';
const config = require('../config');

export default class TutorPageService {

    constructor() {
    }

    static baseURL = () => config.backendUri + '/tutor';

    static getTutorProfileById(_id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/tutorProfilebyId?` + new URLSearchParams({_id}).toString(), function (data) {
                if (data !== undefined || Object.keys(data).length !== 0) {
                    resolve(data);
                }
                else {
                    reject('Error while retrieving tutor profile');
                }
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }
}