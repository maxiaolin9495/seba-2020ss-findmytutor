import MD5 from "react-native-md5";
import HttpService from './HttpService';
const config = require ('../config');

export default class LoginService {
    constructor() {
    }

    static baseURL() {
        return config.backendUri + "/user/login"
    }
    static login(email, pass) {
        return new Promise((resolve, reject) => {
            let hashedPass = MD5.hex_md5(pass);
            HttpService.post(this.baseURL(), {
                email: email,
                password: hashedPass
            }, function(data){
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }
    static logout(){
        window.localStorage.removeItem("jwtTokenFMT")
    }

    //gets data from jwtToken, which is prefilled with user data. Data from database has to be added to token beforehand.


    static isAuthenticated() {
        return window.localStorage.hasOwnProperty('jwtTokenFMT');
    }
}
