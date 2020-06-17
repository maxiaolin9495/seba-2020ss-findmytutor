import HttpService from './HttpService';
const config = require('../config');

export default class SearchService {
    constructor() {
    }
    static baseURL = () => config.backendUri ;

    static getTutorsByKeyword(keyword) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/tutor/search?` + new URLSearchParams({q:keyword}).toString(), function (data) {
                if (data !== undefined || Object.keys(data).length !== 0) {
                    resolve(data);
                }
                else {
                    reject('Error while retrieving movie');
                }
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }
}