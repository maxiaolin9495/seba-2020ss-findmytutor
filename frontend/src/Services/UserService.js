import HttpService from './HttpService';
const config = require ('../config');

export default class UserService {

    static baseURL() {
        return config.backendUri;
    }

    static getCurrentUser() {
        let token = window.localStorage['jwtTokenFMT'];
        if (!token) return {};

        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return {
            email: JSON.parse(window.atob(base64)).email,
            userType: JSON.parse(window.atob(base64)).userType
        };
    }

    static uploadMessage(message, email) {
        return new Promise((resolve, reject) => {
            HttpService.post(this.baseURL()+'/contact/saveMessage', {
                email: email,
                message: message
            }, function (data){
                resolve(data);
            } ,function (textStatus) {
                reject(textStatus);
            });
        });
    }

}