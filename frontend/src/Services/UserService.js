import HttpService from './HttpService';

export default class UserService {

    static baseURL() {
        return "http://localhost:3000"
    }

    static getCurrentUser() {
        let token = window.localStorage['jwtTokenFMC'];
        if (!token) return {};

        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return {
            id: JSON.parse(window.atob(base64)).id
        };
    }

}