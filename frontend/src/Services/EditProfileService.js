"use strict";

import HttpService from './HttpService';
const config = require('../config');

export default class EditProfileService {

    constructor() {
    }

    static baseURL = () => config.backendUri;

    static updateCustomerProfile(profile) {
        profile = {
            ...profile,
            userType: 'customer'
        };
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/customer/uploadCustomerProfile`, profile,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getCustomerProfile() {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/customer/customerProfile`,
                function (data) {
                    if (data !== undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving customer profile');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getCustomerByCustomerEmail(email) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/customer/searchCustomerByEmail?` + new URLSearchParams({q: email}).toString(),
                function (data) {
                    if (data !== undefined) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving customers');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static updateTutorProfile(profile) {
        profile = {
            ...profile,
            userType: 'tutor'
        };
        // TODO: remove above, should done by check authentication
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/tutor/uploadTutorProfile`, profile,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getTutorProfile() {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/tutor/tutorProfile`,
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
}